'use strict';

var Positions = require('../collections/positions');
var Watchlist = require('../collections/watchlist');

module.exports = function(req, res, next) {
    var out = {};
    new Positions()
    .fetch()
    .then((positions) => {
        out.positions = positions.models;
        return new Watchlist().fetch();
    })
    .then((watchlist) => {
        out.watchlist = watchlist.models;
        res.json(out);
    });
}