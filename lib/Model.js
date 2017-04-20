'use strict';

var utils = require('../utils');
var request = require('request');

class Model {
    constructor(options) {
        this.url = null;
        this.attributes = {};
        Object.keys(options).forEach((key) => {
            if (utils.inArray(key, this.props())) this.attributes[key] = options[key];
        });
    }
    props() {
        return [];
    }
    get(key) {
        return utils.hasKey(key, this.attributes) ? this.attributes[key] : null;
    }
    set(key, value) {
        if (utils.inArray(key, this.props())) {
            return this.attributes[key] = value;
        } else {
            return null;
        }
    }
    toJSON() {
        return this.attributes;
    }
    fetch() {
        var options = {
            method: 'get',
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
                let rspns = JSON.parse(body);
                Object.keys(rspns).forEach((key) => {
                    if (utils.inArray(key, this.props())) this.attributes[key] = rspns[key];
                });
                resolve(this);
            });
        });
    }
    create(options) {
        console.log('create was called');
    }
}

module.exports = Model;