'use strict';

var Model = require('../lib/Model');
var config = require('../config');
var utils = require('../utils');

class Price extends Model {
    constructor(options) {
        super(options);
        this.url = config.get('price.api.url')
        + '/'
        + (utils.hasKey('symbol', options) ? options.symbol : 'AAPL')
        + (config.get('price.api.secure.required') ? '?' + config.get('price.api.secure.key') + '=' + process.env.API_KEY : '');
        console.log(this.url);
    }
    props() {
        return [
            'ask_price',
            'ask_size',
            'bid_price',
            'bid_size',
            'last_trade_price',
            'last_extended_hours_trade_price',
            'previous_close',
            'adjusted_previous_close',
            'previous_close_date',
            'symbol',
            'trading_halted',
            'has_traded',
            'last_trade_price_source',
            'updated_at',
            'instrument'
        ];
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new Price(options)
        return instance;
    }
};