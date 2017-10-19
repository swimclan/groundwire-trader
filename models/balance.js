'use strict';

var Model = require('../lib/Model');

class Balance extends Model {
  constructor(options) {
    super(options);
  }
  props() {
    return [
      "day_trade_buying_power",
      "start_of_day_overnight_buying_power",
      "overnight_buying_power_held_for_orders",
      "cash_held_for_orders",
      "created_at",
      "start_of_day_dtbp",
      "day_trade_buying_power_held_for_orders",
      "overnight_buying_power",
      "marked_pattern_day_trader_date",
      "cash",
      "unallocated_margin_cash",
      "updated_at",
      "cash_available_for_withdrawal",
      "margin_limit",
      "outstanding_interest",
      "uncleared_deposits",
      "unsettled_funds",
      "day_trade_ratio",
      "overnight_ratio"
    ];
  }
}

module.exports.getInstance = function(options) {
  var instance = instance || null;
  if (!instance) {
    instance = new Balance(options)
    return instance;
  }
};