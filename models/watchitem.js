'use strict';

var Model = require('../lib/Model');

class WatchItem extends Model {
    constructor(options) {
        super(options);
    }
    props() {
        return [
            'watchlist',
            'instrument',
            'created_at',
            'url'
        ];
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new WatchItem(options)
        return instance;
    }
};