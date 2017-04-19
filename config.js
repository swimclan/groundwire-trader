'use strict';

var utils = require('./utils');

let config = {
    positions: {
        api: {
            url: "https://groundwire.co/api/positions",
            secure: {
                required: true,
                key: "key"
            }
        }
    },
    watchlist: {
        api: {
            url: "https://groundwire.co/api/watchlist",
            secure: {
                required: true,
                key: "key"
            }
        }
    }
}

module.exports.get = function(path) {
    return utils.parseObjectPath(path, config);
}