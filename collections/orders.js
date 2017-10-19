'use strict';
var Collection = require('../lib/Collection');
var Order = require('../models/order');
var _has = require('lodash').has;
var queryString = require('query-string');
var config = require('../config');
var utils = require('../utils');

class Orders extends Collection {
  constructor(options) {
    super(options);
    this.modelClass = Order;
    this.instrument = _has(options, 'instrument') ? options.instrument : null;
    let date = _has(options, 'date') ? options.date.toDate() : null;
    if (date instanceof Date) {
      this.date = utils.isoDateFormat(date);
    } else {
      this.date = '';
    }
    var query = {};
    if (config.get('orders.api.secure.required')) {
      query[config.get('orders.api.secure.key')] = process.env.API_KEY;
    }
    this.url = config.get(`orders.api.url.${process.env.NODE_ENV}`) + `/${this.instrument}/${this.date}?` + queryString.stringify(query);
  }
}

module.exports = Orders;