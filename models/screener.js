'use strict'
var Model = require('../lib/Model');
var config = require('../config');
var queryString = require('query-string');
var DataList = require('../collections/datalist');
var _ = require('lodash');

class Screener extends Model {
    constructor(options={}) {
        super(options);
        var optionsQuery = {};
        var configQuery = _.merge({}, config.get('msn.api.query'));
        if  (_.has(options, 'filters')) optionsQuery.filters = options.filters;
        if  (_.has(options, 'ranges')) optionsQuery.ranges = options.ranges;
        let screenQuery = _.assign(configQuery, optionsQuery);
        this.url = config.get(`msn.api.url.${process.env.NODE_ENV}`) + '?' + queryString.stringify(screenQuery);
    }

    props() {
        return [
            "Count",
            "DataList",
            "filters",
            "ranges"
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