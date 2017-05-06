'use strict';

var utils = require('../utils');
var EventEmitter = require('events');
var config = require('../config');
var request = require('request');

class ModelEmitter extends EventEmitter {}

class Model {
    constructor(options={}) {
        this.modelEmitter = new ModelEmitter();
        this.url = null;
        this.attributes = {};
        this.props().forEach((key) => {
            this.attributes[key] = utils.hasKey(key, options) ? options[key] : null;
        });
        this.modelEmitter.emit('new', this);
    }
    props() {
        return [];
    }
    get(key) {
        return utils.hasKey(key, this.attributes) ? this.attributes[key] : null;
    }
    set(key, value) {
        if (utils.inArray(key, this.props())) {
            this.modelEmitter.emit('change', this.toJSON());
            return this.attributes[key] = value;
        } else {
            return null;
        }
    }
    toJSON() {
        return this.attributes;
    }
    on(event, handler) {
        this.modelEmitter.on(event, handler);
    }
    req(options) {
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
                this.modelEmitter.emit('xhr', this);
                resolve(this);
            });
        });
    }
    fetch() {
        var options = config.get('ajax.fetch.options');
        options.url = this.url;
        return this.req(options);
    }
    create(form) {
        var options = config.get('ajax.create.options');
        options.url = this.url;
        options.form = form;
        return this.req(options);
    }
}

module.exports = Model;