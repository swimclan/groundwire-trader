'use strict';

let Collection = require('../lib/Collection');
let Holiday = require('../models/Holiday');
let config = require('../config');

class Holidays extends Collection {
    constructor() {
        super();
        this.modelClass = Holiday;
        this.url = config.get(`holidays.api.url.${process.env.NODE_ENV}`) + (config.get('holidays.api.secure.required') ? '?' + config.get('holidays.api.secure.key') + '=' + process.env.API_KEY : '');
    }
}

module.exports = Holidays;
