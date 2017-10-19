'use strict';
var Model = require('../lib/Model');

class Language extends Model {
  constructor(options={}) {
    super(options);
  }

  props() {
    return [
      "d",
      "l",
      "v"
    ];
  }
}

module.exports.getInstance = function(options) {
  var instance = instance || null;
  if (!instance) {
    instance = new Language(options)
    return instance;
  }
};
