'use strict';
var Position = require('../models/position');
var request = require('request');

class Positions {
    constructor() {
        this.models = [];
    }

}

module.exports.getInstance = function() {
    return new Positions()
}