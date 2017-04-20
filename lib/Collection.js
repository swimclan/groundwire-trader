"use strict";
var request = require('request');
var utils = require('../utils');

module.exports = class Collection {
    constructor() {
        this.url = null;
        this.modelClass = null;
        this.models = [];
        this.url = null;
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
                let collection = JSON.parse(body);
                var results = utils.hasKey('results', collection) ? collection.results : collection;
                for (var i in results) {
                    this.models.push(this.modelClass.getInstance(results[i]));
                }
                resolve(this);
            });
        });
    }
    toJSON() {
        let ret = [];
        this.models.forEach((model) => {
            ret.push(model.attributes);
        });
        return ret;
    }
    at(i) {
        if (i <= this.models.length - 1) {
            return this.models[i];
        } else {
            return [];
        }
    }
}