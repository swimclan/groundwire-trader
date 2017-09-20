'use strict';

var Queue = require('../collections/queue');
var Trade = require('../models/trade');
var Cancel = require('../models/cancel');
var _ = require('lodash');
var utils = require('../utils');
var Logger = require('../Logger');
var config = require('../config');
var async = require('async');

let logger = new Logger(config.get('log.level'), config.get('log.file'));

class Sweeper {
    constructor(options={}) {
        this.instrument = null;
        this.trade = null;
        if (_.has(options, 'trade')) {
            logger.log('debug', 'sweeper initialized', options.trade);
            this.instrument = utils.parseInstrumentIdFromUrl(options.trade.instrument);
            this.trade = options.trade
        }
        return this;
    }

    sweep() {
        return new Promise((resolve, reject) => {
            if (this.instrument === null) {
                logger.log('error', 'Sweeper error', 'Invalid or no instrument passed to sweeper');
                reject({error: 'Invalid or no instrument passed to sweeper'});
                return;
            }
            let count = 0;
            let swept = false;
            let goodQueue = false;
            async.whilst(
                () => {
                    return count <= config.get('sweeper.retries') && !swept;
                },
                (callback) => {
                    count++;
                    logger.log('debug', 'Sweep attempt', `#${count}`);
                    this.getQueue()
                    .then((queue) => {
                        if (queue.length > 0) {
                            logger.log('debug', 'Sweeper queue fetched', queue.at(0).toJSON());
                            return this.cancelOrder();
                        } else {
                            swept = true;
                            return Promise.resolve();
                        }
                    }).catch((err) => { callback(err) })
                    .then((result) => {
                        if (!_.isUndefined(result) && result.action === 'cancel') {
                            logger.log('debug', 'Sweeper cancel', result);
                            return this.newSell();
                        } else {
                            return Promise.resolve();
                        }
                    }).catch((err) => { callback(err) })
                    .then((trade) => {
                        if (_.isUndefined(trade)) {
                            logger.log('error', 'Sweeper trade', 'Sweeper trade failed');
                            callback({error: 'Sweeper trade failed to execute'}, null);
                        } else {
                            logger.log('debug', 'Sweeper trade success', trade.toJSON());
                            setTimeout(() => {
                                callback(null, trade.get('instrument'));
                            }, config.get('sweeper.interval'));
                        }
                    }).catch((err) => { callback(err) });
                },
                (err, instrument) => {
                    if (err) {
                        logger.log('error', 'Sweeper failed', this.instrument);
                        reject(err);
                    }
                    logger.log('info', `Sweeper complete for instrument id: ${this.instrument}`, this.instrument);
                    resolve(this.instrument);
                }
            )
        });
    }

    getQueue() {
        return new Promise((resolve, reject) => {
            new Queue({instrument: this.instrument, trigger: 'immediate'}).fetch()
            .then((queue) => {
                resolve(queue);
            })
            .catch((err) => {
                logger.log('error', 'Sweeper error', 'Failed to fetch queue for sweeper operation');
                reject({error: 'Failed to fetch queue'});
            });
        });
    }

    cancelOrder() {
        return new Promise((resolve, reject) => {
            Cancel.getInstance().destroy({
                instrumentId: this.instrument,
                trigger: 'immediate'
            })
            .then(() => {
                resolve({action: 'cancel', instrument: this.instrument, trigger: 'immediate' });
            }).catch((err) => { reject(err) });
        });
    }

    newSell() {
        return new Promise((resolve, reject) => {
            Trade.getInstance().create({
                instrumentId: this.instrument,
                quantity: parseInt(this.trade.quantity).toString(),
                type: 'sell'
            })
            .then((trade) => {
                resolve(trade);
            }).catch((err) => { reject(err) });
        });
    }
}

module.exports = Sweeper;