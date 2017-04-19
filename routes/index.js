var express = require('express');
var router = express.Router();
var createPosition = require('../controllers/createPosition');

/* GET  */
router.get('/position/create/:shares/:time', createPosition);

module.exports = router;
