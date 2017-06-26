'use strict'
var Model = require('../lib/Model');
var config = require('../config');
var queryString = require('query-string');

class Screener extends Model {
    constructor(options={}) {
        super(options);
        this.url = config.get(`msn.api.url.${process.env.NODE_ENV}`) + '?' + queryString.stringify(config.get('msn.api.query'));
    }

    props() {
        return [
            "Count",
            "DataList"
        ];
    }

    collections() {
        return {
            DataList: DataList
        };
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new Screener(options);
        return instance;
    }
};