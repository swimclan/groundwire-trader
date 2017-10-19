'use strict';

var Socket = require('../lib/Socket');
var Quote = require('../models/quote');
var config = require('../config');
var _has = require('lodash').has;
var queryString = require('query-string');

class Stream extends Socket {
  constructor(options={}) {
    super(options);
    this.modelClass = Quote;
    var root = config.get(`price.socket.url.${process.env.NODE_ENV}`),
    query = {
      ticker: _has(options, 'ticker') ? options.ticker : config.get('price.socket.defaults.ticker'),
      simulate: _has(options, 'simulate') && (options.simulate == 0 || options.simulate == 1) ? options.simulate : 0
    }
    if (config.get('price.socket.secure.required')) {
      query[config.get('price.socket.secure.key')] = process.env.API_KEY
    }
    this.url = `${root}?${queryString.stringify(query)}`;
    this.target = 'quote';
    this.connect(options);
  }
}

module.exports = Stream;