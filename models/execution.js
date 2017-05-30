'use strict';
var Model = require('../lib/Model');

class Execution extends Model {
    constructor(options={}) {
        super(options);
    }
    props() {
        return [
            "timestamp",
            "price",
            "settlement_date",
            "id",
            "quantity"
        ];
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new Execution(options)
        return instance;
    }
};