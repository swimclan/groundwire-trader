'use strict';

var utils = require('./utils');

let config = {
    timeouts: {
        buy: 3000,
        sell: 0
    },
    positions: {
        api: {
            url: {
                production: "https://groundwire.co/api/positions",
                development: "http://localhost:3000/api/positions",
            },
            secure: {
                required: true,
                key: "key"
            }
        }
    },
    watchlist: {
        api: {
            url: {
                production: "https://groundwire.co/api/watchlist",
                development: "http://localhost:3000/api/watchlist",
            },
            secure: {
                required: true,
                key: "key"
            }
        }
    },
    price: {
        api: {
            url: {
                production: "https://groundwire.co/api/price",
                development: "http://localhost:3000/api/price",
            },
            secure: {
                required: true,
                key: "key"
            }
        },
        socket: {
            url: {
                production: "https://groundwire.co",
                development: "http://localhost:3000",
            },
            secure: {
                required: true,
                key: "key"
            }
        }
    },
    trade: {
        api: {
            url: {
                production: "https://groundwire.co/api/trade",
                development: "http://localhost:3000/api/trade",
            },
            secure: {
                required: true,
                key: "key"
            }
        }
    },
    queue: {
        api: {
            url: {
                production: "https://groundwire.co/api/queue",
                development: "http://localhost:3000/api/queue",
            },
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