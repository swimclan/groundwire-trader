'use strict';

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
