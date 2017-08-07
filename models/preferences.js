'use strict';

var Model = require('../lib/Model');

class Preferences extends Model {
    constructor(options={}) {
        super(options);
    }
    props() {
        return [
            'screenmax',
            'screenfilters',
            'screenranges'
        ];
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new Preferences(options)
        return instance;
    }
};