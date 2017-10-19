'use strict';

var Model = require('../lib/Model');
var config = require('../config');

class Cancel extends Model {
  constructor(options={}) {
    super(options);
    this.url = config.get('cancel.api.url')[process.env.NODE_ENV] + '/' + (config.get('cancel.api.secure') ? '?key=' + process.env.API_KEY : '');
  }
}

module.exports.getInstance = function(options) {
  var instance = instance || null;
  if (!instance) {
    instance = new Cancel(options)
    return instance;
  }
};