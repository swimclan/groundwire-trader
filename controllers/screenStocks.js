'use strict';
var Screener = require('../models/screener');

module.exports = function(req, res, next) {
    Screener.getInstance().fetch()
    .then((stocks) => {
        console.log(stocks.toJSON());
        res.json(stocks);
    })
    .catch((err) => {
        res.json({error: err});
    });
}
