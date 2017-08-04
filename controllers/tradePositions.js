'use strict';

var utils = require('../utils');
var _ = require('lodash');
var Stream = require('../streams/stream');
var Positions = require('../collections/positions');
var Instrument = require('../models/instrument');
var Trade = require('../models/trade');
var async = require('async');
var config = require('../config');
var strategies = require('../strategies');
var Strategy = require('../lib/Strategy');
var Analytics = require('../Analytics');
var Holidays = require('../collections/holidays');
var Orders = require('../collections/orders');
var ProfitLock = require('../models/profitLock');
var Logger = require('../Logger');

let logger = new Logger(config.get('log.level'), config.get('log.file'));

let options = {};

module.exports = function(req, res, next) {
    logger.log('info', 'initiating', 'initializing positions trade routine');
    options.exclusions = [];
    options.connection_state = true;
    options.connection_message = "Stream connection established";
    options.profitLock = ProfitLock.getInstance({enabled: false, margin: null, executed: false});

    if (_.has(req.body, 'exclusions')) {
        options.exclusions = options.exclusions.concat(utils.splitStringList(req.body.exclusions));
    }
    
    if (!_.has(req.body, 'stopmargin')) {
        logger.log('error', 'missing request property', 'No stop margin was found in request.');
        return utils.throwError("No stop margin was found! Please include a stop margin percentage...", res);
    }
    if (!_.has(req.body, 'strategy')) {
        logger.log('error', 'missing request property', 'No strategy was specified in request.');
        return utils.throwError("No strategy was specified.  Please supply a valid strategy...", res);
    }
    options.stopMargin = parseFloat(req.body.stopmargin);
    options.userStrategy = req.body.strategy;

    options.restrict = _.has(req.body, 'restrict') ? (req.body.restrict === 'true') || (req.body.restrict === '1') : false;

    if (!options.stopMargin) {
        logger.log('error', 'data format error', 'Invalid stop margin provided.');
        return utils.throwError("Invalid stop margin provided", res);
    }

    if (_.has(req.body, 'profitlock')) {
        options.profitLock.set('enabled', true);
        options.profitLock.set('margin', parseFloat(req.body.profitlock));
        logger.log('info', 'profit lock enabled', options.profitLock.toJSON());
    }

    new Holidays().fetch()
    .then((holidays) => {
        options.holidays = holidays;
        if (!utils.isMarketClosed(holidays)) return new Positions().fetch();
        logger.log('error', 'market closed error', `Market is closed for ${utils.isMarketClosed(holidays)}`);
        options.connection_message = `Connection aborted.  Market is closed for ${utils.isMarketClosed(holidays)}`;
        options.connection_state = false;
        return null;
    })
    .catch((err) => {
        logger.log('error', 'market calendar fetch error', err);
        options.connection_message = "Connection aborted. Unable to fetch market holiday calendar";
        return null;
    })
    .then((positions) => {
        return excludePositions(positions ? positions.toJSON() : []);
    })
    .catch((err) => {
        logger.log('error', 'positions fetch error', err);
        options.connection_state = false;
        options.connection_message = "Connection aborted.  Unable to fetch positions.";
        return [];
    })
    .then((tradeables) => {
        if (tradeables.length < 1) {
            options.connection_state = false;
            options.connection_message = "Connection aborted.  No new tradeable positions found";
            logger.log('debug', 'tradeables check', "Connection aborted.  No new tradeable positions found");
        }
        async.eachOfSeries(tradeables, (tradeable, i, callback) => {
            Promise.all([
                openStream(tradeable.symbol),
                config.get('analytics.enabled') ? new Analytics().authorize().create(utils.logFileName(tradeable.symbol, options.userStrategy)) : Promise.resolve(null)
            ])
            .then(([stream, analytics]) => {
                return trackPosition(stream, tradeable, analytics)
            }).catch((err) => { callback(err); })
            .then(() => {
                callback();
            }).catch((err) => { callback(err); });
        },
        (err) => {
            if (err) {
                logger.log('error', 'track position error', err);
                options.connection_state = false;
            }
            res.status(options.connection_state ? 200 : 202);
            res.json({message: options.connection_message});
        });
    })
    .catch((err) => {
        utils.throwError('Connection routine failed', res);
    });
}

var openStream = function(ticker) {
    logger.log('info', 'open stream', 'opening stream');
    return new Promise((resolve, reject) => {
        let connect_handler = () => {
            logger.log('info', 'stream connect', 'Connected to the GroundWire price socket');
        };

        let close_handler = (reason) => {
            logger.log('info', 'stream disconnect', reason);
        };

        let error_handler = (err) => {
            logger.log('error', 'stream connect error', err);
            reject(err);
        };

        let outStream = new Stream({
            ticker: ticker,
            simulate: process.env.SIMULATE,
            connect_handler: connect_handler,
            close_handler: close_handler,
            error_handler: error_handler
        });
        resolve(outStream);
    });
}

var excludePositions = function(positions) {
    var ret = [];
    return new Promise((resolve, reject) => {
        logger.log('info', 'position exclusion', 'excluding positions');
        async.eachSeries(positions, (position, callback) => {
            logger.log('info', 'position recency', 'checking position recency');
            recentPosition(position)
            .then((pos) => {
                if (pos) return Instrument.getInstance({instrument: utils.parseInstrumentIdFromUrl(pos.instrument)}).fetch();
            }).catch((err) => { callback(err) })
            .then((inst) => {
                if (!_.isUndefined(inst) && !utils.inArray(inst.toJSON().symbol, options.exclusions)) {
                    ret.push({
                        symbol: inst.get('symbol'),
                        quantity: parseInt(position.quantity),
                        cost: parseFloat(position.average_buy_price)
                    });
                }
                callback();
            }).catch((err) => { callback(err); });
        },
        (err) => {
            if (err) {
                logger.log('error', 'exclude positions', err);
                reject(err);
            }
            resolve(ret);
        });
    });
}

var recentPosition = function(position) {
    return new Promise((resolve, reject) => {
        logger.log('debug', 'position order check', 'instrument: ' + utils.parseInstrumentIdFromUrl(position.instrument));
        new Orders({instrument: utils.parseInstrumentIdFromUrl(position.instrument)}).fetch()
        .then((orders) => {
            let _orders = orders.toJSON();
            logger.log('debug', 'position order', _orders.length + ' orders found');
            let found = false;
            for (var i in _orders) {
                if (utils.positionCreatedLastWeekday(_orders[i].created_at, options.holidays)) {
                    logger.log('debug', 'position recency', "Position was created in the last trading day");
                    found = true;
                    break;
                }
            };
            resolve(found || !options.restrict ? position : null);
        }).catch((err) => {
            logger.log('error', 'order fetch error', err);
            reject(err)
        });
    });
}

var trackPosition = function(priceStream, instrument, analytics) {
    return new Promise((resolve, reject) => {
        // The container that will house all data about the state of the current tick of market data
        var tick = {}, ticks = [];;

        var stopPrice, 
        currentMargin,
        bestProfitMargin = -Infinity, 
        bestAsk = 0, 
        newHigh, 
        firstAsk,
        dayMargin;

        switch (process.env.SIMULATE) {
            case '0':
                options.simulation_state = 'off';
                break;
            default:
                options.simulation_state = 'on';
        }

        if (priceStream) {
            logger.log('info', 'position tracking',
                {
                    ticker: instrument.symbol,
                    simulation: options.simulation_state,
                    strategy: options.userStrategy,
                    initial_stop: options.stopMargin,
                    cost: instrument.cost,
                    spread_max: config.get('trading.spread.max'),
                    spread_min: config.get('trading.spread.min')
            });

            priceStream.on('frame', (frame) => {
                tick.ticker = frame.ticker;
                switch(frame.type) {
                    case 'bid':
                        tick.bid = frame.price;
                        break;
                    case 'ask':
                        firstAsk = !firstAsk ? tick.ask : firstAsk;
                        tick.ask = frame.price;
                        break;
                    case 'last':
                        tick.last = frame.price;
                }
                if (_.has(tick, 'bid') && _.has(tick, 'ask')) {
                    var maxdiff = config.get('trading.spread.max') * tick.ask;
                    var mindiff = config.get('trading.spread.min') * tick.ask;
                    if (((tick.ask - tick.bid) < maxdiff) && ((tick.ask - tick.bid) > mindiff) && (tick.ask - tick.bid > 0)) {
                        if (analytics) ticks.push(_.assign({}, tick));
                        // calculate profit margins
                        currentMargin = (tick.ask - instrument.cost) / instrument.cost;
                        bestProfitMargin = currentMargin > bestProfitMargin ? currentMargin : bestProfitMargin;
                        dayMargin = (tick.ask - firstAsk) / firstAsk;
                        // Calculate best ask
                        newHigh = tick.ask > bestAsk;
                        bestAsk = newHigh ? tick.ask : bestAsk;
                        // Initial stop price or calculated new stopPrice from strategy execution
                        if (!stopPrice) {
                            stopPrice = tick.ask / (1 + options.stopMargin)
                        } else if (!_.isUndefined(tick.lastask)) {
                            // determine if profit lock is on and if it needs to be executed on the stop price
                            stopPrice = options.profitLock.lockCheck(stopPrice, instrument.cost, currentMargin) ? 
                            instrument.cost :
                            new Strategy(options.userStrategy, strategies,
                                {
                                lastPrice: tick.lastask,
                                currentPrice: tick.ask,
                                lastStop: stopPrice,
                                coefficient: config.get('trading.strategies.c'),
                                minStopMargin: config.get('trading.strategies.minStopMargin'),
                                cost: instrument.cost,
                                bestProfitMargin: bestProfitMargin,
                                initialStopMargin: options.stopMargin,
                                newHigh: newHigh
                                }).execute();
                        }
                        tick.stop = utils.moneyify(stopPrice);
                        
                        if (tick.stop < tick.ask) {
                            logger.log('debug', 'price tick', tick);
                            tick.lastbid = _.has(tick, 'bid') ? tick.bid : null;
                            tick.lastask = _.has(tick, 'ask') ? tick.ask : null;
                            tick.lastlast = _.has(tick, 'last') ? tick.last : null;
                        } else {
                            priceStream.disconnect();
                            sellPosition(instrument, tick.ask)
                            .then((trade) => {
                                logger.log('debug', 'sell position',
                                    {
                                        ticker: tick.ticker,
                                        stop: tick.stop,
                                        ask: tick.ask,
                                        quantity: instrument.quantity,
                                    });
                                logger.log('debug', 'trade confirmation', trade.toJSON());
                                if (analytics) analytics.update(['bid', 'ask', 'stop', 'last'], ticks);
                            }).catch((err) => { return null });
                        }
                    }
                }
            });
            priceStream.on('close', (reason) => {
                logger.log('info', 'stream exit', reason);
            });
            resolve();
        } else {
            logger.log('error', 'stream error', 'No stream was connected.')
            reject("No stream was connected.");
        }
    });
}

var sellPosition = function(instrument, price) {
    return new Promise((resolve, reject) => {
        logger.log('info', 'trade create', 'creating sell order');
        Trade.getInstance().create({
            symbol: instrument.symbol,
            quantity: instrument.quantity.toString(),
            type: 'sell'
        })
        .then((trade) => {
            resolve(trade);
        }).catch((err) => { reject(err); });
    });
}
