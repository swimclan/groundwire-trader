'use strict';

var moment = require('moment');

module.exports.parseObjectPath = function(path, obj) {
    let params = path.split('.');
    var value = obj;
    for (var i in params) {
        if (Object.keys(value).indexOf(params[i]) !== -1) {
            value = value[params[i]];
        } else {
            return null;
        }
    }
    return value;
}

module.exports.splitStringList = function(list) {
  var redux = list.replace(/\s/, "");
  return redux.split(',');
}

module.exports.hasKey = function(key, obj) {
    return Object.keys(obj).indexOf(key) !== -1;
}

module.exports.inArray = function(item, arr) {
    return arr.indexOf(item) !== -1;
}

module.exports.parseInstrumentIdFromUrl = function(url) {
  var urlChunks = url.split('/');
  for (var i in urlChunks) {
    if (urlChunks[i].split('-').length > 1) return urlChunks[i];
  }
}

module.exports.throwError = function(error, res) {
    res.status(500);
    return res.json({error: error});
}

module.exports.nullPromise = function() {
    return new Promise((resolve, reject) => { resolve(null); });
}

module.exports.moneyify = function(n) {
  return (Math.floor(n*100)/100);
}

module.exports.findMin = function(collection, key) {
    var min = Infinity, min_index;
    collection.forEach((item, i) => {
        if (parseInt(item[key]) < min) {
            min = parseInt(item[key]);
            min_index = i;
        }
    });
    return collection[min_index];
}

module.exports.logFileName = function(ticker, strategy) {
    return `${Date.now().toString()}_${ticker}_${moment(Date.now()).format('YYYYMMDD')}_${strategy}`;
}

module.exports.today = function() {
    return moment().day();
}

module.exports.tzOffset = function() {
    var today = moment();
    return moment.parseZone(today).utcOffset();
}

module.exports.lastWeekday = function() {
  var current = moment();
  while (true) {
    current = current.subtract(1, 'day');
    if ((current.day() >= 1) && (current.day() <= 5)) break;
  }
  return current;
}

module.exports.positionCreatedLastWeekday = function(create_date) {
    return this.lastWeekday().dayOfYear() === moment(create_date).dayOfYear();
}

module.exports.isMarketClosed = function(holidays) {
    let today = moment();
    var i = 0;
    let _holidays = holidays.toJSON();
    while(i < _holidays.length) {
        if (today.dayOfYear() === moment(_holidays[i].date).utcOffset(-this.tzOffset()).dayOfYear()) return _holidays[i].holiday;
        i++;
    }
    return false;
}

module.exports.spreadTitle = function(title) {
    var titlearr = title.toUpperCase().split('');
    for (var i=0; i<titlearr.length; i++) {
      if (i % 2 !== 0) {
        titlearr.splice(i, 0, ' ');
      }
    }
    return titlearr.join('');
}
