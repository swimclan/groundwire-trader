'use strict';

var Model = require('../lib/Model');

class Eligibility extends Model {
  constructor(options) {
    super(options);
  }
  props() {
    return [
      "updated_at",
      "reason",
      "reinstatement_date",
      "reversal",
      "state"
    ];
  }
}

module.exports.getInstance = function(options) {
  var instance = instance || null;
  if (!instance) {
    instance = new Eligibility(options)
    return instance;
  }
};