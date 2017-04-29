'use strict';

var utils = require('./utils');

let config = {
    timeouts: {
        buy: 3000,
        sell: 0
    },
    trading: {
        spread: {
            min: 0,
            max: 0.02
        },
        sigma: {
            min: 0,
            max: 3
        }
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
    instrument: {
        api: {
            url: {
                production: "https://groundwire.co/api/instrument",
                development: "http://localhost:3000/api/instrument"
            },
            secure: {
                required: true,
                key: "key"
            },
            defaults: {
                ticker: 'AAPL'
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
            },
            defaults: {
                ticker: 'AAPL'
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
    let params = path.indexOf(',') !== -1 ? path.split(',') : [path];
    var ret = utils.parseObjectPath(params[0], config);
    if (params.length > 1) {
        var searchRx;
        for (var i=1; i<params.length; i++) {
            searchRx = new RegExp('(\\$t)(' + i + ')');
            ret = ret.replace(searchRx, params[i]);
        }
    }
    return ret;
}