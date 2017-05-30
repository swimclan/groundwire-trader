'use strict';

let Collection = require('../lib/Collection');
let Execution = require('../models/execution');
let config = require('../config');

class Executions extends Collection {
    constructor(options={}) {
        super(options);
        this.modelClass = Execution;
    }
}

module.exports = Executions;