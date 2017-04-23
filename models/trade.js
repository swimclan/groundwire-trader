'use strict';

var Model = require('../lib/Model');
var utils = require('../utils');
var config = require('../config');

class Trade extends Model {
    constructor(options={}) {
        super(options);
        this.url = config.get(`trade.api.url.${process.env.NODE_ENV}`) + (config.get('trade.api.secure.required') ? '?' + config.get('trade.api.secure.key') + '=' + process.env.API_KEY : '');
    }
    props() {
        return [
            'updated_at',
            'ref_id',
            'time_in_force',
            'fees',
            'cancel',
            'id',
            'cumulative_quantity',
            'stop_price',
            'reject_reason',
            'instrument',
            'state',
            'trigger',
            'override_dtbp_checks',
            'type',
            'last_transaction_at',
            'price',
            'executions',
            'extended_hours',
            'account',
            'url',
            'created_at',
            'side',
            'override_day_trade_checks',
            'position',
            'average_price',
            'quantity'
        ];
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new Trade(options)
        return instance;
    }
};