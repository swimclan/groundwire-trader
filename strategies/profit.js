'use strict';
var utils = require('../utils');

module.exports = function(args) {
  var ret = null;
  if (utils.hasKey('lastStop', args)
  && utils.hasKey('currentPrice', args)
  && utils.hasKey('initialStopMargin', args)
  && utils.hasKey('coefficient', args)
  && utils.hasKey('minStopMargin', args)
  && utils.hasKey('bestProfitMargin', args)) {
    var checkStopMargin = args.initialStopMargin - args.bestProfitMargin;
    var targetStop = args.currentPrice / (1 + (args.coefficient * checkStopMargin));
    ret = (checkStopMargin >= args.minStopMargin && targetStop >= args.lastStop) ? targetStop : args.lastStop;
  }
  return ret
}
