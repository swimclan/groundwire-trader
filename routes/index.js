var express = require('express');
var router = express.Router();
var createPositions = require('../controllers/createPositions');
var tradePositions = require('../controllers/tradePositions');
var package = require('../package.json');
/* Create Positions from Watchlist */
router.get('/positions/create/:shares?', createPositions);

/* Trade stocks that have current positions */
router.post('/positions/trade', tradePositions)

/* Get the version number of the application */
router.get('/version', function(req, res, next) {
    res.json({ version: package.version });
});

module.exports = router;
