'use strict';

var request = require('request');
var Collection = require('../lib/Collection');
var WatchItem = require('../models/watchitem');
var config = require('../config');

class Watchlist extends Collection {
    constructor() {
        super();
        this.modelClass = WatchItem;
        this.url = config.get('watchlist.api.url') + (config.get('watchlist.api.secure.required') ? '?' + config.get('watchlist.api.secure.key') + '=' + process.env.API_KEY : '');
    }
}

module.exports = Watchlist;
