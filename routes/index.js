var express = require('express');
var router = express.Router();
var createPositions = require('../controllers/createPositions');

/* GET  */
router.get('/positions/create/:shares', createPositions);

module.exports = router;
