'use strict';
var Collection = require('../lib/Collection');
var ScreenItem = require('../models/screenitem');

class DataList extends Collection {
    constructor(options={}) {
        super(options);
        this.modelClass = ScreenItem;
    }
}

module.exports = DataList;
