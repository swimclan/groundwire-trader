'use strict';

var utils = require('../utils');
var _ = require('lodash');
var Stream = require('../streams/stream');

module.exports = function(req, res, next) {
    var exclusions = [];
    if (_.has(req.body, 'exclusions')) {
        exclusions = utils.splitStringList(req.body.exclusions);
    }

    let connect_handler = () => {
        console.log('Connected to the GroundWire price socket!');
        //res.json({message: "Connected to the price stream"});
    };

    let priceStream = new Stream({ticker: 'WFT', connect_handler: connect_handler});
    priceStream.frame.on('change', function(frame) {
        console.log(frame);
    });
}