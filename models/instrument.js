var Model = require('../lib/Model');
var _has = require('lodash').has;
var queryString = require('query-string');
var config = require('../config');

class Instrument extends Model {
    constructor(options={}) {
        super(options);
        this.ticker = _has(options, 'ticker') ? options.ticker : config.get('instrument.api.defaults.ticker');
        this.instrument = _has(options, 'instrument') ? options.instrument : null;
        this.type = this.instrument ? 'instrument' : 'symbol';
        this.value = this.instrument || this.ticker;
        var query = {};
        if (config.get('instrument.api.secure.required')) {
            query[config.get('instrument.api.secure.key')] = process.env.API_KEY;
        }
        this.url = config.get(`instrument.api.url.${process.env.NODE_ENV}`) + `/${this.type}/${this.value}?` + queryString.stringify(query);
    }
    props() {
        return [
            "min_tick_size",
            "splits",
            "margin_initial_ratio",
            "url",
            "quote",
            "symbol",
            "bloomberg_unique",
            "list_date",
            "fundamentals",
            "state",
            "country",
            "day_trade_ratio",
            "tradeable",
            "maintenance_ratio",
            "id",
            "market",
            "name" 
        ];
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new Instrument(options)
        return instance;
    }
};