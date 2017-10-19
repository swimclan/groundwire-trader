'use strict';
var User = require('../models/user');

module.exports = function(req, res, next) {
  let user = User.getInstance().fetch()
  .then(function(currentUser) {
    res.json(currentUser.toJSON());
  })
  .catch(function(err) {
    res.json({error: err});
  });
}