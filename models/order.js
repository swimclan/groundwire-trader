'use strict';
var Model = require('../lib/Model');
var Executions = require('../collections/executions');
var config = require('../config');

class Order extends Model {
  constructor(options={}) {
    super(options);
  }
  props() {
    return [
      "updated_at",
      "ref_id",
      "time_in_force",
      "fees",
      "cancel",
      "id",
      "cumulative_quantity",
      "stop_price",
      "reject_reason",
      "instrument",
      "state",
      "trigger",
      "override_dtbp_checks",
      "type",
      "last_transaction_at",
      "price",
      "executions",
      "extended_hours",
      "account",
      "url",
      "created_at",
      "side",
      "override_day_trade_checks",
      "position",
      "average_price",
      "quantity"
    ];
  }
  collections() {
    return {
      executions: Executions
    }
  }
}

module.exports.getInstance = function(options) {
  var instance = instance || null;
  if (!instance) {
    instance = new Order(options)
    return instance;
  }
};