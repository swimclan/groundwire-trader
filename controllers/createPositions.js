'use strict';

var Watchlist = require('../collections/watchlist');
var Screener = require('../models/screener');
var Positions = require('../collections/positions');
var Trade = require('../models/trade');
var Price = require('../models/price');
var Instrument = require('../models/instrument');
var utils = require('../utils');
var config = require('../config');
var async = require('async');
var Accounts = require('../collections/accounts');
var Holidays = require('../collections/holidays');
var _ = require('lodash');
var Logger = require('../Logger');

let logger = new Logger(config.get('log.level'), config.get('log.file'));

module.exports = function(req, res, next) {
    logger.log('info', 'initiating', 'initializing positions create routine');
    var shares = utils.hasKey('shares', req.params) ? req.params.shares : null;
    logger.log('debug', 'request body', `shares specified: ${shares ? shares : 'none'}`);
    var buying_power, connection_state=true, connection_message;

    new Holidays().fetch()
    .then((holidays) => {
        if (!utils.isMarketClosed(holidays)) return new Accounts().fetch();
        logger.log('error', 'market closed error', `Market is closed for ${utils.isMarketClosed(holidays)}`);
        connection_message = `Market is closed for ${utils.isMarketClosed(holidays)}`;
        connection_state = false;
        return null;
    })
    .catch((err) => {
        connection_message = "Position create aborted.  Market holiday calendar could not be fetched.";
        connection_state = false;
        logger.log('error', 'holiday fetch error', err);
        return null;
    })
    .then((accts) => {
        var account = _.find(accts ? accts.toJSON() : [], { account_number: process.env.ACCT_NO });
        buying_power = account ? account.margin_balances.overnight_buying_power : null;
        return new Positions().fetch();
    }).catch((err) => {
        connection_message = "Position create aborted.  RH account balance could not be fetched.";
        connection_state = false;
        logger.log('error', 'positions fetch error', err);
        return new Positions().fetch();
    })
    .then((positions) => {
        let positionList = [];
        positions.toJSON().forEach((position) => {
            positionList.push(utils.parseInstrumentIdFromUrl(position.instrument));
        });
        if (connection_state) {
            tradeStockList(res, positionList, shares, buying_power);
        } else {
            res.status(500);
            res.json({message: connection_message});
        }
    }).catch((err) => {
        utils.throwError(err, res)
    });
}

var tradeStockList = function(res, positions, shares, balance) {
    var trades = [];
    logger.log('info', 'watchlist fetch', 'fetching watch list items');
    Promise.all([new Watchlist().fetch(), Screener.getInstance().fetch()])
    .then(([watchlist, screens]) => {
        let screenedList = screens.get('DataList');
        return allocateBalance(res, watchlist, screenedList, positions, balance, shares);
    })
    .then((portfolio) => {
        async.eachSeries(portfolio, (item, callback) => {
            let inst = utils.parseInstrumentIdFromUrl(item.instrument);
            logger.log('info', 'trade create', `creating buy order for ${inst}`);
            if (item.shares > 0) {
                Trade.getInstance().create({
                    instrumentId: inst,
                    quantity: item.shares,
                    type: 'buy'
                })
                .then((trade) => {
                    logger.log('debug', 'trade confirmation', trade.toJSON());
                    trades.push(trade.toJSON());
                    setTimeout(callback, config.get('timeouts.trade'));
                }).catch((err) => { callback(err) });
            } else {
                callback();
                logger.log('debug', 'No shares', 'No shares were requested.  Must have at least one share to execute position');
            }
        }, (error) => {
            if (error) return utils.throwError(error, res);
            res.json(trades);
        });
    }).catch((err) => { utils.throwError(err, res) });
}

var allocateBalance = function(res, watchlist, screenList, positions, balance, shares=null) {
    var portfolio = [];
    var balance_left = balance;
    let stockList = mergeStockLists(screenList, watchlist);
    logger.log('info', 'balance allocation', `allocating balance starting with $${balance_left.toString()}`);
    return new Promise((resolve, reject) => {
        async.eachSeries(stockList, (stockitem, callback) => {
            if (stockitem.type === 'watchlist') {
                var inst = utils.parseInstrumentIdFromUrl(stockitem.instrument);
                logger.log('info', 'instrument fetch', `fetching instrument ${inst}`);
            } else {
                var tick = stockitem.ticker;
                logger.log('info', 'ticker fetch', `fetching ticker ${tick}`);
            }
            let instArg = stockitem.type === 'screen' ? { ticker: tick } : { instrument: inst };
            Instrument.getInstance(instArg).fetch()
            .then((stock) => {
                inst = utils.parseInstrumentIdFromUrl(stock.get('id'));
                if (!stock.get('tradeable') || utils.inArray(inst, positions)) {
                    logger.log('debug', 'tradeable check', `${stock.get('symbol')} is not tradeable`);
                    return null;
                }
                logger.log('info', 'price fetch', `fetching price for ticker symbol ${stock.get('symbol')}`)
                return Price.getInstance({ symbol: stock.get('symbol') }).fetch()
            }).catch((err) => { callback(err) })
            .then((price) => {
                if (price) {
                    let targetInst = {
                        instrument: inst,
                        price: utils.moneyify(parseFloat(price.get('last_trade_price'))),
                        shares: shares ? parseInt(shares) : 0
                    };
                    logger.log('debug', 'purchaseable instrument', targetInst);
                    portfolio.push(targetInst);
                }
                callback();
            }).catch((err) => { callback(err) });
        },
        (error) => {
            if (error) return reject(error);
            if (portfolio.length < 1) return resolve([]);
            var minPrice = utils.findMin(portfolio, 'price').price;
            while ((balance_left > minPrice) && !shares) {
                portfolio.forEach((item, i) => {
                    if (balance_left > item.price) {
                        portfolio[i].shares ++;
                        balance_left -= item.price;
                    }
                });
            }
            resolve(portfolio);
        });
    });
}

var mergeStockLists = function(screenList, watchlist) {
    var screenRedux = screenList.map(screenStock => ({type: 'screen', ticker: screenStock.Sym}));
    screenRedux.splice(config.get('screener.max'));
    var watchListRedux = watchlist.models.map(watchListStock => ({type: 'watchlist', instrument: watchListStock.get('instrument')}));
    return [...watchListRedux, ...screenRedux];
}
