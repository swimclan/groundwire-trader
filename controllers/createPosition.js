'use strict';

var Positions = require('../collections/positions');

module.exports = function(req, res, next) {
    new Positions()
    .fetch()
    .then((positions) => {
        console.log(positions.at(0).created_at);
        res.json({message: "Successful"});
    });
}