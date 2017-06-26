'use strict';
var Collection = require('../lib/Collection');
var Language = require('../models/language');

class CompanyLanguages extends Collection {
    constructor(options={}) {
        super(options);
        this.modelClass = Language;
    }
}

module.exports = CompanyLanguages;