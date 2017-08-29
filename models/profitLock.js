'use strict';

var Model = require('../lib/Model');

class ProfitLock extends Model {
    constructor(options={}) {
        super(options);
    }
    props() {
        return [
            'margin',
            'executed',
            'enabled'
        ];
    }
    lockCheck(lastStop, cost, currentReturn) {
        if (this.get('enabled') && (currentReturn >= this.get('margin')) && (lastStop < cost) && !this.get('executed')) {
            this.set('executed', true);
            return true;
        }
        return false;
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new ProfitLock(options)
        return instance;
    }
}