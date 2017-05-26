'use strict';
var utils = require('../utils');

module.exports = function(args) {
    var ret = null;
    if (utils.hasKey('lastPrice', args)
     && utils.hasKey('currentPrice', args)
     && utils.hasKey('lastStop', args)
     && utils.hasKey('coefficient', args)
     && utils.hasKey('minStopMargin', args)
     && utils.hasKey('newHigh', args)) {
         let priceSlope = args.currentPrice - args.lastPrice;
         let stopSlope = args.coefficient * priceSlope;
         let stopMarginCheck = (args.currentPrice - (stopSlope + args.lastStop)) / args.currentPrice;
         ret = (priceSlope > 0) && (stopMarginCheck > args.minStopMargin) && args.newHigh ? stopSlope + args.lastStop : args.lastStop;
     }
     return ret;
}
