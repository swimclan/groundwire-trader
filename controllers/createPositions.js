'use strict';

var Watchlist = require('../collections/watchlist');
var Positions = require('../collections/positions');
var Trade = require('../models/trade');
var Queue = require('../collections/queue');
var utils = require('../utils');
var config = require('../config');
var async = require('async');

module.exports = function(req, res, next) {
    let shares = parseInt(req.params.shares);

    new Positions().fetch()
    .then((positions) => {
        let positionList = [];
        positions.toJSON().forEach((position) => {
            positionList.push(utils.parseInstrumentIdFromUrl(position.instrument));
        })
        tradeWatchlist(res, positionList, shares);
    })
    .catch((err) => {
        utils.throwError(err, res);
    });
}

var tradeWatchlist = function(res, positions, shares) {
    var trades = [];
    new Watchlist().fetch()
    .then((watchlist) => {
        async.eachSeries(watchlist.models, (watchitem, callback) => {
            let inst = utils.parseInstrumentIdFromUrl(watchitem.get('instrument'));
            if (utils.inArray(inst, positions)) return callback();
            Trade.getInstance().create({
                instrumentId: inst,
                quantity: shares,
                type: 'buy'
            })
            .then((trade) => {
                trades.push(trade.toJSON());
                setTimeout(callback, config.get('timeouts.buy'));
            })
            .catch((err) => {
                console.log(err);
                callback(err);
            });
        }, (error) => {
            if (error) {
                utils.throwError(error, res);
            }
            res.json(trades) 
        });
    }).catch((err) => {
        utils.throwError(err, res);
    });
}