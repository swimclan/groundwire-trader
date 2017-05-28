'use strict';
let Model = require('../lib/Model');

class Holiday extends Model {
    constructor(options={}) {
        super(options);
    }
    props() {
        return [
            'date',
            'holiday'
        ];
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new Holiday(options)
        return instance;
    }
};