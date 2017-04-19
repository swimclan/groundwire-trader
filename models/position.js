'use strict';

class Position {
    constructor(options) {
        this.account = options.account;
        this.intraday_quantity = options.intraday_quantity;
        this.intraday_average_buy_price = options.intraday_average_buy_price;
        this.url = options.url;
        this.created_at = options.created_at;
        this.updated_at = options.updated_at;
        this.shares_held_for_buys = options.shares_held_for_buys;
        this.average_buy_price = options.average_buy_price;
        this.instrument = options.instrument;
        this.shares_held_for_sells = options.shares_held_for_sells;
        this.quantity = options.quantity;
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new Position(options)
        return instance;
    }
};