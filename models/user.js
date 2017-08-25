'use strict';

var Model = require('../lib/Model');
var config = require('../config');

class User extends Model {
    constructor(options) {
        super(options);
        this.url = config.get('user.api.url')[process.env.NODE_ENV] + '/' + (config.get('user.api.secure') ? '?key=' + process.env.API_KEY : '');
        console.log(this.url);
    }
    props() {
        return [
            'username',
            'first_name',
            'last_name',
            'id_info',
            'url',
            'email_verified',
            'created_at',
            'basic_info',
            'email',
            'investment_profile',
            'id',
            'international_info',
            'employment',
            'additional_info',
            'auth_token'
        ];
    }
}

module.exports.getInstance = function(options) {
    var instance = instance || null;
    if (!instance) {
        instance = new User(options)
        return instance;
    }
};