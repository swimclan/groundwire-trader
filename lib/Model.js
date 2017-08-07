'use strict';

var utils = require('../utils');
var EventEmitter = require('events');
var config = require('../config');
var request = require('request');
var _ = require('lodash');

class ModelEmitter extends EventEmitter {}

class Model {
    constructor(options={}) {
        this.modelEmitter = new ModelEmitter();
        this.url = null;
        this.attributes = {};
        this.props().forEach((key) => {
            if  (utils.hasKey(key, options)) {
                if (utils.hasKey(key, this.children())) {
                    this.attributes[key] = this.children()[key].getInstance(options[key]).toJSON();
                } else if (utils.hasKey(key, this.collections())) {
                    let Collection = this.collections()[key];
                    this.attributes[key] = new Collection().populate(options[key]).toJSON();
                } else {
                    this.attributes[key] = options[key];
                }
            } else {
                this.attributes[key] = null;
            }
        });
        this.modelEmitter.emit('new', this);
    }
    props() {
        return [];
    }
    children() {
        return {};
    }
    collections() {
        return {};
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
                if (rspns) {
                    Object.keys(rspns).forEach((key) => {
                        if (utils.inArray(key, this.props())) this.attributes[key] = rspns[key];
                    });
                } else {
                    this.props().forEach((key) => {
                        this.attributes[key] = null;
                    });
                };
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
    has(attr) {
        if (Array.isArray(attr)) {
            var ret = true;
            attr.forEach((key) => {
                if (!_.has(this.attributes, key)) {
                    ret = false;
                } else if (this.attributes[key] === null || !_.isUndefined(this.attributes[key])) {
                    ret = false;
                }
            });
            return ret;
        } else if (typeof attr === 'string') {
            return _.has(this.attributes, attr) && this.attributes[attr] !== null && !_.isUndefined(this.attributes[attr]);
        } else {
            return false;
        }
    }
}

module.exports = Model;