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
var Logger = require('../Logger');

module.exports = function(req, res, next) {
    var exclusions = [];
    if (_.has(req.body, 'exclusions')) {
        exclusions = exclusions.concat(utils.splitStringList(req.body.exclusions));
    }
    if (!_.has(req.body, 'stopmargin')) {
        return utils.throwError("No stop margin was found! Please include a stop margin percentage...", res);
    }
    if (!_.has(req.body, 'strategy')) {
        return utils.throwError("No strategy was specified.  Please supply a valid strategy...", res);
    }
    let stopMargin = parseFloat(req.body.stopmargin);
    let userStrategy = req.body.strategy;

    if (!stopMargin) return utils.throwError("Invalid stop margin provided", res);

    new Positions().fetch()
    .then((positions) => {
        return excludePositions(exclusions, positions.toJSON());
    }).catch((err) => { utils.throwError(err, res) })
    .then((tradeables) => {
        async.eachOfSeries(tradeables, (tradeable, i, callback) => {
            Promise.all([
                openStream(tradeable.symbol),
                new Logger().authorize().create(utils.logFileName(tradeable.symbol, userStrategy))
            ])
            .then(([stream, logger]) => {
                return trackPosition(stream, tradeable, stopMargin, userStrategy, logger)
            }).catch((err) => { callback(err); })
            .then(() => {
                callback();
            }).catch((err) => { callback(err); });
        },
        (err) => {
            if (err) utils.throwError(err, res);
            res.json({message: "Connected to the GroundWire Price Stream"});
        });
    }).catch((err) => { utils.throwError(err, res) })
}

var openStream = function(ticker) {
    return new Promise((resolve, reject) => {
        let connect_handler = () => {
            console.log('Connected to the GroundWire price socket!');
        };

        let close_handler = (reason) => {
            console.log('Disconnected from the GroundWire price socket...  Goodbye!');
            console.log(reason);
        };

        let error_handler = (err) => {
            console.log('There was an error connecting to the GroundWire price socket');
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

var excludePositions = function(exclusions, positions) {
    var ret = [];
    return new Promise((resolve, reject) => {
        async.eachSeries(positions, (position, callback) => {
            Instrument.getInstance({instrument: utils.parseInstrumentIdFromUrl(position.instrument)})
            .fetch()
            .then((inst) => {
                if (!utils.inArray(inst.toJSON().symbol, exclusions)) {
                    ret.push({
                        symbol: inst.get('symbol'),
                        quantity: parseInt(position.quantity),
                        cost: parseFloat(position.average_buy_price)
                    });
                }
                callback();
            });
        },
        (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(ret);
        });
    });
}

var trackPosition = function(priceStream, instrument, stopMargin, strategy, logger) {
    return new Promise((resolve, reject) => {
        // The container that will house all data about the state of the current tick of market data
        var tick = {}, ticks = [];;

        var stopPrice, simulation_state, currentMargin, bestProfitMargin = -Infinity;

        switch (process.env.SIMULATE) {
            case '0':
                simulation_state = 'off';
                break;
            default:
                simulation_state = 'on';
        }

        if (priceStream) {
            console.log('-------------------------------------');
            console.log('T R A D I N G   C O N F I G');
            console.log('-------------------------------------');
            console.log('Ticker:', instrument.symbol);
            console.log('simulation mode:', simulation_state);
            console.log('initial stop margin:', stopMargin);
            console.log('average cost:', instrument.cost);
            console.log('Max spread:', config.get('trading.spread.max'));
            console.log('Min spread:', config.get('trading.spread.min'));
            console.log('-------------------------------------');

            priceStream.on('frame', (frame) => {
                tick.ticker = frame.ticker;
                switch(frame.type) {
                    case 'bid':
                        tick.bid = frame.price;
                        break;
                    case 'ask':
                        tick.ask = frame.price;
                        break;
                    case 'last':
                        tick.last = frame.price;
                }
                if (_.has(tick, 'bid') && _.has(tick, 'ask')) {
                    var maxdiff = config.get('trading.spread.max') * tick.ask;
                    var mindiff = config.get('trading.spread.min') * tick.ask;
                    if (((tick.ask - tick.bid) < maxdiff) && ((tick.ask - tick.bid) > mindiff) && (tick.ask - tick.bid > 0)) {
                        ticks.push(_.assign({}, tick));
                        // calculate profit margin
                        currentMargin = (tick.ask - instrument.cost) / instrument.cost;
                        bestProfitMargin = currentMargin > bestProfitMargin ? currentMargin : bestProfitMargin;

                        // Initial stop price or calculated new stopPrice from strategy execution
                        if (!stopPrice) {
                            stopPrice = tick.ask / (1 + stopMargin)
                        } else if (!_.isUndefined(tick.lastask)) {
                        stopPrice = new Strategy(strategy, strategies,
                                {
                                lastPrice: tick.lastask,
                                currentPrice: tick.ask,
                                lastStop: stopPrice,
                                coefficient: config.get('trading.strategies.c'),
                                minStopMargin: config.get('trading.strategies.minStopMargin'),
                                cost: instrument.cost,
                                bestProfitMargin: bestProfitMargin,
                                initialStopMargin: stopMargin
                                }).execute();
                        }
                        tick.stop = utils.moneyify(stopPrice);
                        
                        if (tick.stop < tick.ask) {
                            console.log(tick);
                            tick.lastbid = _.has(tick, 'bid') ? tick.bid : null;
                            tick.lastask = _.has(tick, 'ask') ? tick.ask : null;
                            tick.lastlast = _.has(tick, 'last') ? tick.last : null;
                        } else {
                            priceStream.disconnect();
                            sellPosition(instrument, tick.ask)
                            .then((confirm) => {
                                console.log('---------------------------------------------');
                                console.log("Ticker:", tick.ticker);
                                console.log("Stopped out at:",tick.stop);
                                console.log("Ask price was:", tick.ask);
                                console.log("Quantity:", instrument.quantity);
                                console.log('Trade confirmation ===>');
                                console.log(confirm.toJSON());
                                console.log('---------------------------------------------');
                        
                                logger.update(['bid', 'ask', 'stop', 'last'], ticks);

                            }).catch((err) => { return null });
                        }
                    }
                }
            });
            priceStream.on('close', (reason) => {
                console.log("Exited price stream:", reason);
            });
            resolve();
        } else {
            reject("No tradeable instruments were found...");
        }
    });
}

var sellPosition = function(instrument, price) {
    return new Promise((resolve, reject) => {
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
