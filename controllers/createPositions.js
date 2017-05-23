'use strict';

var Watchlist = require('../collections/watchlist');
var Positions = require('../collections/positions');
var Trade = require('../models/trade');
var Price = require('../models/price');
var Instrument = require('../models/instrument');
var utils = require('../utils');
var config = require('../config');
var async = require('async');
var Accounts = require('../collections/accounts');
var _ = require('lodash');

module.exports = function(req, res, next) {
    var shares = utils.hasKey('shares', req.params) ? req.params.shares : null;
    var buying_power;

    new Accounts().fetch()
    .then((accts) => {
        var account = _.find(accts.toJSON(), { account_number: process.env.ACCT_NO });
        buying_power = account.margin_balances.overnight_buying_power;
        return new Positions().fetch();
    }).catch((err) => { utils.throwError(err, res) })
    .then((positions) => {
        let positionList = [];
        positions.toJSON().forEach((position) => {
            positionList.push(utils.parseInstrumentIdFromUrl(position.instrument));
        });
        tradeWatchlist(res, positionList, shares, buying_power);
    }).catch((err) => { utils.throwError(err, res) });
}

var tradeWatchlist = function(res, positions, shares, balance) {
    var trades = [];
    new Watchlist().fetch()
    .then((watchlist) => {
        return allocateBalance(res, watchlist, positions, balance, shares);
    })
    .then((portfolio) => {
        async.eachSeries(portfolio, (item, callback) => {
            let inst = utils.parseInstrumentIdFromUrl(item.instrument);
            Trade.getInstance().create({
                instrumentId: inst,
                quantity: item.shares,
                type: 'buy'
            })
            .then((trade) => {
                trades.push(trade.toJSON());
                setTimeout(callback, config.get('timeouts.trade'));
            }).catch((err) => { callback(err) });
        }, (error) => {
            if (error) return utils.throwError(error, res);
            res.json(trades);
        });
    }).catch((err) => { utils.throwError(err, res) });
}

var allocateBalance = function(res, watchlist, positions, balance, shares=null) {
    var portfolio = [];
    var balance_left = balance;
    return new Promise((resolve, reject) => {
        async.eachSeries(watchlist.models, (watchitem, callback) => {
            var inst = utils.parseInstrumentIdFromUrl(watchitem.get('instrument'));
            if (utils.inArray(inst, positions)) return callback();
            Instrument.getInstance({ instrument: inst }).fetch()
            .then((stock) => {
                if (!stock.get('tradeable')) return callback();
                return Price.getInstance({ symbol: stock.get('symbol') }).fetch()
            }).catch((err) => { callback(err) })
            .then((price) => {
                portfolio.push({ 
                    instrument: inst,
                    price: price.get('last_trade_price'),
                    shares: shares ? parseInt(shares) : 0 
                });
                callback();
            }).catch((err) => { callback(err) });
        },
        (error) => {
            if (error) return reject(error);
            if (portfolio.length < 1) return resolve([]);
            var minPrice = utils.findMin(portfolio, 'price').price;
            //while (balance_left > minPrice) {
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
