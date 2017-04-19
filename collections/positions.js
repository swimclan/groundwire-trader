'use strict';

var Collection = require('../lib/Collection');
var request = require('request');
var config = require('../config');
var Position = require('../models/position');

class Positions extends Collection {
    constructor() {
        super();
        this.modelClass = Position;
        this.models = [];
        this.url = config.get('positions.api.url') + (config.get('positions.api.secure.required') ? '?' + config.get('positions.api.secure.key') + '=' + process.env.API_KEY : '');
    }
}

module.exports = Positions;
