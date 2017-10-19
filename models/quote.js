'use strict';

var Model = require('../lib/Model');

class Quote extends Model {
  constructor(options={}) {
    super(options);
  }
  props() {
    return [
      'type',
      'timestamp',
      'ticker',
      'size',
      'price'
    ];
  }
}

module.exports.getInstance = function(options={}) {
  var instance = instance || null;
  if (!instance) {
    instance = new Quote(options)
    return instance;
  }
};