'use strict';

var Collection = require('../lib/Collection');
var config = require('../config');
var Trade = require('../models/trade');

class Queue extends Collection {
    constructor() {
        super();
        this.modelClass = Trade;
        this.url = config.get('queue.api.url') + (config.get('queue.api.secure.required') ? '?' + config.get('queue.api.secure.key') + '=' + process.env.API_KEY : '');
    }
}

module.exports = Queue;