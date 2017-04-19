'use strict';
var Position = require('../models/position');
var request = require('request');
var config = require('../config');

class Positions {
    constructor() {
        console.log(process.env.API_KEY);
        this.models = [];
        this.url = config.get('positions.api.url') + (config.get('positions.api.secure.required') ? '?' + config.get('positions.api.secure.key') + '=' + process.env.API_KEY : '');
    }
}

module.exports = Positions;