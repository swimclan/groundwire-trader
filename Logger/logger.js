'use strict';
var fs = require('fs');
var utils = require('../utils');

class Logger {
  constructor(level, logfile) {
    this.levels = ['info', 'error', 'debug', 'off'];
    this.level = this.getLevel(level);
    this.logFile = logfile;
  }

  getLevel(type) {
    return this.levels.indexOf(type) >= 0 ? this.levels.indexOf(type) : 0;
  }

  log(type, title, data) {
    let _type = type.toLowerCase();
    if (this.getLevel(_type) <= this.level && this.level !== 3) {
      this.logToFile(type, title, data);
      this.logToConsole(type, title, data);
    }
  }

  logToConsole(type, title, data) {
    if (typeof data === 'object') {
      console.log('-------------------------------------------------------------------------------------------------------------');
      console.log(this.highlightLevel(type) + ' -- ' + utils.spreadTitle(title));
      console.log('-------------------------------------------------------------------------------------------------------------');
      console.log(`timestamp: ${new Date().toISOString()}`);
      Object.keys(data).forEach((key) => {
        console.log(`${key}: ${data[key]}`);
      });
    } else if (typeof data === 'string') {
      console.log('-------------------------------------------------------------------------------------------------------------');
      console.log(`${new Date().toISOString()} | ${this.highlightLevel(type)} | ${title} | ${data}`)
    }
  }

  logToFile(type, title, data) {
    if (typeof data === 'object') {
      fs.writeFileSync(this.logFile, '-------------------------------------------------------------------------------------------------------------\n', {flag: 'a'});
      fs.writeFileSync(this.logFile, type + ' -- ' + utils.spreadTitle(title) + '\n', {flag: 'a'});
      fs.writeFileSync(this.logFile, '-------------------------------------------------------------------------------------------------------------\n', {flag: 'a'});
      fs.writeFileSync(this.logFile, `timestamp: ${new Date().toISOString()}\n`, {flag: 'a'});
      Object.keys(data).forEach((key) => {
        fs.writeFileSync(this.logFile, `${key}: ${data[key]}\n`, {flag: 'a'});
      });
    } else if (typeof data === 'string') {
      fs.writeFileSync(this.logFile, '-------------------------------------------------------------------------------------------------------------\n', {flag: 'a'});
      fs.writeFileSync(this.logFile, `${new Date().toISOString()} | ${type} | ${title} | ${data}\n`, {flag: 'a'})
    }
  }

  highlightLevel(text) {
    var ret;
    switch(text) {
      case 'error':
        ret = `\x1b[31m${text}\x1b[0m`;
        break;
      case 'debug':
        ret = `\x1b[33m${text}\x1b[0m`;
        break;
      case 'info':
        ret = `\x1b[32m${text}\x1b[0m`;
        break;
      default:
        ret = text;
    }
    return ret;
  }
}

module.exports = Logger;