'use strict';

var io = require('socket.io-client');
var _has = require('lodash').has;

class Socket {
    constructor(options={}) {
        this.url;
        this.modelClass;
        this.frame;
        this.target;
        this.socket;
    }
    connect(options={}) {
        this.frame = this.modelClass.getInstance();
        this.socket = io.connect(this.url);
        this.on = (event, handler) => { this.socket.on(event, handler); };
        this.on('connect', _has(options, 'connect_handler') ? options.connect_handler : () => {
            console.log('Successfully connected to the socket stream');
        });
        this.on('close', _has(options, 'close_handler') ? options.close_handler : (reason) => {
            console.log('Socket stream closed.\n', reason);
        });
        this.on(this.target, (frame) => {
            var framekeys = Object.keys(frame);
            for (var i in framekeys) {
                this.frame.set(framekeys[i], frame[framekeys[i]]);
            }
        });
    }
}

module.exports = Socket;