'use strict';

var io = require('socket.io-client');
var _has = require('lodash').has;
var EventEmitter = require('events');

class SocketEmitter extends EventEmitter {}

class Socket {
  constructor(options={}) {
    this.url;
    this.socketEmitter = new SocketEmitter();
    this.modelClass;
    this.frame;
    this.target;
    this.socket;
  }
  connect(options={}) {
    this.frame = this.modelClass.getInstance();
    this.socket = io.connect(this.url);
    this.on = (event, handler) => {
      this.socketEmitter.on(event, handler);
    };
    this.emit = (evt, args, callback) => {
      this.socket.emit(evt, args, callback);
    };
    this.socket.on('connect', _has(options, 'connect_handler') ? options.connect_handler : () => {
      console.log('Successfully connected to the socket stream');
    });
    this.socket.on('disconnect', _has(options, 'close_handler') ? options.close_handler : (reason) => {
      console.log('Socket stream disconnected.', reason);
    });
    this.socket.on('error', _has(options, 'error_handler') ? options.error_handler : (err) => {
      console.log('An error occured in the socket stream');
      console.log(err);
    })
    this.socket.on(this.target, (frame) => {
      var framekeys = Object.keys(frame);
      for (var i in framekeys) {
        this.frame.set(framekeys[i], frame[framekeys[i]]);
      }
      this.socketEmitter.emit('frame', this.frame.toJSON());
    });
  }
  disconnect() {
    return this.socket ? this.socket.disconnect() : null;
  }
}

module.exports = Socket;