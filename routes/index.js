var express = require('express');
var router = express.Router();
var createPositions = require('../controllers/createPositions');
var tradePositions = require('../controllers/tradePositions');
var package = require('../package.json');
var screenStocks = require('../controllers/screenStocks');
var userLogin = require('../controllers/userlogin');

/* Create Positions from Watchlist (GET) */
router.get('/positions/create/:shares?', createPositions);

/* Create Positions from Watchlist (POST) */
router.post('/positions/create/:shares?', createPositions);

/* Trade stocks that have current positions */
router.post('/positions/trade', tradePositions)

/* Get the version number of the application */
router.get('/version', function(req, res, next) {
  res.json({ version: package.version });
});

/* Login with a username & password */
router.post('/user/login', userLogin);

/* Get the MSN screener */
router.get('/screen', screenStocks);

module.exports = router;
