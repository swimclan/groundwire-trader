'use strict';

var Collection = require('../lib/Collection');
var config = require('../config');
var Trade = require('../models/trade');
var _ = require('lodash');

class Queue extends Collection {
    constructor(options={}) {
        super();
        this.modelClass = Trade;
        if (_.has(options, 'instrument') && _.has(options, 'trigger')) {
            let instrument = options.instrument;
            let trigger = options.trigger === 'immediate' || options.trigger === 'stop' ? options.trigger : null;
            this.url = config.get(`queue.api.url.${process.env.NODE_ENV}`) + `/${trigger}/${instrument}/` + (config.get('queue.api.secure.required') ? '?' + config.get('queue.api.secure.key') + '=' + process.env.API_KEY : '');
        } else {
            this.url = config.get(`queue.api.url.${process.env.NODE_ENV}`) + (config.get('queue.api.secure.required') ? '?' + config.get('queue.api.secure.key') + '=' + process.env.API_KEY : '');
        }
    }
}

module.exports = Queue;