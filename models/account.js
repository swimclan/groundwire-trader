'use strict';
var Balance = require('../models/balance');
var Eligibility = require('../models/eligibility');
var Model = require('../lib/Model');

class Account extends Model {
  constructor(options={}) {
    super(options);
  }
  props() {
    return [
      "deactivated",
      "updated_at",
      "margin_balances",
      "portfolio",
      "cash_balances",
      "withdrawal_halted",
      "cash_available_for_withdrawal",
      "type",
      "sma",
      "sweep_enabled",
      "deposit_halted",
      "buying_power",
      "user",
      "max_ach_early_access_amount",
      "instant_eligibility",
      "cash_held_for_orders",
      "only_position_closing_trades",
      "url",
      "positions",
      "created_at",
      "cash",
      "sma_held_for_orders",
      "account_number",
      "uncleared_deposits",
      "unsettled_funds"
    ];
  }
  children() {
    return {
      margin_balances: Balance,
      instant_eligibility: Eligibility
    }
  }
};

module.exports.getInstance = function(options) {
  var instance = instance || null;
  if (!instance) {
    instance = new Account(options)
    return instance;
  }
};