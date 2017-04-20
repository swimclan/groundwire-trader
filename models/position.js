'use strict';

var Model = require('../lib/Model');

class Position extends Model {
    constructor(options) {
        super(options);
    }
    props() {
        return [
            'account',
            'intraday_quantity',
            'intraday_average_buy_price',
            'url',
            'created_at',
            'updated_at',
            'shares_held_for_buys',
            'average_buy_price',
            'instrument',
            'shares_held_for_sells',
            'quantity'
        ];
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new Position(options)
        return instance;
    }
};