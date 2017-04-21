'use strict';

var Positions = require('../collections/positions');
var Watchlist = require('../collections/watchlist');
var Price = require('../models/price');
var Trade = require('../models/trade');
var Queue = require('../collections/queue');

module.exports = function(req, res, next) {
    var out = {};
    new Positions()
    .fetch()
    .then((positions) => {
        out.positions = {account: positions.at(0).get('account')};
        return new Watchlist().fetch();
    })
    .then((watchlist) => {
        out.watchlist = {instrument: watchlist.at(2).get('instrument')};
        return Price.getInstance({symbol: 'NFLX'}).fetch();
    })
    .then((price) => {
        out.price = {ask: price.get('ask_price')};
        return new Queue().fetch();
    })
    .then((queue) => {
        out.queue = queue.at(0).get('id');
        res.json(out);
    });
}