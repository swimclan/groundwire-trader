'use strict';

var Positions = require('../collections/positions');
var Watchlist = require('../collections/watchlist');
var Price = require('../models/price');
var Trade = require('../models/trade');

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
        return Trade.getInstance().create({
            instrumentId: '2e153a47-7b8a-4ebc-a37b-a3848288166b',
            quantity: 1,
            type: 'buy'
        });
    })
    .then((buy) => {
        out.buy = {state: buy.get('state'), side: buy.get('side'), type: buy.get('type')};
        return Trade.getInstance().create({
            instrumentId: '2e153a47-7b8a-4ebc-a37b-a3848288166b',
            quantity: 1,
            type: 'sell',
            stop_price: 0.56
        });
    })
    .then((sell) => {
        out.sell = sell.toJSON();
        res.json(out);
    });
}