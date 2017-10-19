'use strict';

var Collection = require('../lib/Collection');
var config = require('../config');
var Account = require('../models/account');

class Accounts extends Collection {
  constructor() {
    super();
    this.modelClass = Account;
    this.url = config.get(`accounts.api.url.${process.env.NODE_ENV}`) + (config.get('accounts.api.secure.required') ? '?' + config.get('accounts.api.secure.key') + '=' + process.env.API_KEY : '');
  }
}

module.exports = Accounts;
