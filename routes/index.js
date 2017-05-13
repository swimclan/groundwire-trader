var express = require('express');
var router = express.Router();
var createPositions = require('../controllers/createPositions');
var tradePositions = require('../controllers/tradePositions');
/* Create Positions from Watchlist */
router.get('/positions/create/:shares?', createPositions);

/* Trade stocks that have current positions */
router.post('/positions/trade', tradePositions)

module.exports = router;
