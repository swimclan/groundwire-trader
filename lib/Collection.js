"use strict";
var request = require('request');

module.exports = class Collection {
    constructor() {
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
                var results = Object.keys(collection).indexOf('results') !== -1 ? collection.results : collection;
                for (var i in results) {
                    this.models.push(this.modelClass.getInstance(results[i]));
                }
                resolve(this);
            });
        });
    }

    at(i) {
        return this.models[i];
    }
}