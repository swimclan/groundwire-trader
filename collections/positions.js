'use strict';

var Position = require('../models/position');
var request = require('request');
var config = require('../config');
var Position = require('../models/position');

class Positions {
    constructor() {
        this.modelClass = Position;
        this.models = [];
        this.url = config.get('positions.api.url') + (config.get('positions.api.secure.required') ? '?' + config.get('positions.api.secure.key') + '=' + process.env.API_KEY : '');
    }

    fetch() {
        var options = {
            url: this.url,
            auth: {
                user: process.env.USERNAME,
                pass: process.env.PASSWORD
            }
        };
        return new Promise((resolve, reject) => {
            request(options, (err, response, body) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                let positions = JSON.parse(body);
                for (var i in positions) {
                    this.models.push(this.modelClass.getInstance(positions[i]));
                }
                resolve(this)
            });
        });
    }

    at(i) {
        return this.models[i];
    }
}

module.exports = Positions;