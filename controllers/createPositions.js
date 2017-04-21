'use strict';

var Watchlist = require('../collections/watchlist');
var Positions = require('../collections/positions');
var Trade = require('../models/trade');
var Queue = require('../collections/queue');
var utils = require('../utils');
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
        console.log(err);
        res.send(err);
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
                callback();
            });
        }, (error) => {
            if (error) {
                console.log(error);
                res.json({error: error});
            }
            res.json(trades) 
        });
    }).catch((err) => {
        console.log(err);
        res.json({error: err});
    });
}