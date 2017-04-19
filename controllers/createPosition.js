'use strict';

var Positions = require('../collections/positions');

module.exports = function(req, res, next) {
    let positions = new Positions();
    res.json(positions);
}