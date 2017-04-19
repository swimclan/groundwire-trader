'use strict';

class WatchItem {
    constructor(options) {
        this.watchlist = options.watchlist;
        this.instrument = options.instrument;
        this.created_at = options.created_at;
        this.url = options.url;
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new WatchItem(options)
        return instance;
    }
};