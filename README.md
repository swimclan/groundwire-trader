# Overview
This is the GroundWire trading application.  It is a server that is configured to execute trades according to various built-in strategies.  Once positions are generated, the server will monitor price action using the Intrinio&trade; Real-Time Exchange websocket stream and implement a trailing stop loss for each stock position that it is configured to manage. The trailing stop loss algorithm is configurable to be less or more agressive in terms of price tracking so as to be intelligent about how to lock in profit margin or minimize loss.

# Version
1.15.0
<br>
<em>See</em> [`CHANGELOG.md`](./CHANGELOG.md) <em>for more detailed view of all versions</em>

# Routes

| Route                          | HTTP Verb         | Request Body                        | Description                                      |
| ------------------------------ | ----------------- | ----------------------------------- | ------------------------------------------------ |
| `/positions/create/:quantity?` | GET               | N/A                                 | This route when requested will kick off the purchasing of all instruments that are in the user's watch list.  Only tradeable instruments will be bought.  Orders with untradeable insrtuments will simply not be filled. An optional share quantity can be appended to the request URL.  If no share quantity is specified, the app will automatically determine how many shares to buy for each stock based on how much buying power is in account |
| `/positions/create/:quantity?` | POST              | (1) `screenmax <integer>`: a number representing the max number of screened auto picks made for the user<br>(2) `screenfilters <string>` a string representing the stock screener filter on MSN<br>(3)`screenranges <string>` a string representing the stock screener ranges on MSN | This route is identical to the GET route above with the exception of the fact that it takes some stock screener config params as payload in the request body to allow users to set their own stock picking preferences.  When params are ommited from the request body, the app will fall back to its own config |
| `/positions/trade`             | POST              | (1) `exclusions <string>`: a comma seperated list of tickers to ignore<br>(2) `stopmargin <float>`: A decimal value representing the percentage of the initial stop loss margin of the strategy in use<br>(3) `strategy <string>` The descriptor for the trailing stop-loss strategy desired (e.g. `slope`)<br>(4) `restrict <bool>` Switch to enforce strict single day position tracking.  If ommitted it will default to false<br>(5) `profitlock <float>` Specify a position profit margin that will trigger a break-even stop loss<br>(6) `maxspread <float>` The maximum spread % of the bid-ask<br>(7) `minstop <float>` The minimum stop margin that any strategy will compress to<br>(8) `c <float>` The "chase coefficient" | This route will kick off the trading process for any stock positions currently in the market that are not in the exclusions list.  Once the best ask price is less than the current stop loss, it will execute a market sell into Robinhood at the last best ask price |

# Strategies

Stop loss values are calculated according to several supported trailing-stop-loss strategies which can be [read about here](./strategies/README.md).  An optional `profitlock` parameter can be included in the position trade call to lock in a break-even stop loss once a specified profit margin is received.  This is to ensure that no loss will be taken on trades that move up early.

# Stock Pick Automation

App can be configured to automatically pick stocks based on an MSN stock screener lookup. Set the `screener.max` value in app config.js to set the maximum number of stock picks made from the screener.

# Analytics

The trading app integrates with Google Drive to log all the market tracking data and stop loss trails.  This feature is enabled through a configuration parameter.  Set the desired OAuth config parameters in `.env`:

Example:
```sh
GOOGLE_OAUTH_CLIENT='{"installed":{"client_id":"468730889874-nrgbmkn6lethohnc7fjbnqctfh2bgdgm.apps.googleusercontent.com","project_id":"flowing-encoder-167801","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"upqv7hljH9OFB6DE5rIfXecz","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}'
GOOGLE_OAUTH_TOKEN='{"access_token":"ya29.GltMBE6UIbWfCIQ7NGO3TD6nX8-n9N6crQc7d6crFyVKeoMTbPDr5OJU0hUZ9ttqU9aYwCdK0L3rrA8CRCGIK6jakgkJXrSFePuUo3T_ykM3kVeUZj330t6luelZ","refresh_token":"1/Q5swwl9D0xc2CPbptWeainSQm6a4JJ1oHwsD43unhwLle5gzBWPGPB9oI81uWLa_","token_type":"Bearer","expiry_date":2851901131000}'
```

# Holidays

The trading app will observe all posted market holidays and will not attempt to buy or sell during those days.  Holiday calendar is provided by [tradingeconomics.com](https://tradingeconomics.com).

# Interday swing trading

The trading app is aware of when positions were aqcuired in the market and will allow positions to be tracked over the course of multiple days.  Logic has been introduced to prevent the app from re-tracking a position that is already under monitor just because the position remained live beyond the first day.  Trading app will also treat weekday holidays as not-a-weekday and find positions to monitor that entered the market on the day prior to the holiday.

# Security

Username and password for the target Robinhood account must be stored as an environment variable on the server that is hosting the trading application.  The environment variables take the form:

Example:
```sh
USERNAME=username
PASSWORD=password
```

Where `username` and `password` are the username and password of the user's target Robinhood account.

Additionally, the target Robinhood account number must also be specified in order to target the correct buying power value when determining how many shares to purchase for each stock in the user's watch list.

Example:
```sh
ACCT_NO=4FW23F99
```

Also, a required `API_KEY` must be present as an environment variable also.  This key is the target key for accessing the Groundwire trading API.  See [documentation for GroundWire Trading API](https://gitlab.com/ground_wire/node_repo/blob/master/README.md) for more information.

Example:
```sh
API_KEY=ioqbewfvoihub
```

## SSL

SSL Certificates are supported for being able to send secure requests to the GroundWire API.

# Environments

There are currently two environments that are supported in the trading app: (1) `development` and (2) `production`.  The specified environment must be defined as an environment variable using the key `NODE_ENV`.  If `development` is specified, all calls to the trading API will be made locally which means that you must have a locally running version of the GroundWire trading API.  If `production` is specified on `NODE_ENV` then all calls to the trading API will be made to the production endpoint at `groundwire.co/api`. 

Example:
```
NODE_ENV=development
```

# Continuous Deployment 

This server is configured to utilize the GitLab Continuous Integration (CI) service.  All commits on the master branch within the source code repository hosted at GitLab will automatically trigger a build/deploy procedure on GitLab and on the Groundwire Trading API server.

# Running Locally

This application can be run locally on your development computer.  Simply clone down the repo, set the appropriate environent variables in the `.env` file and run it with `npm start`.

After running the server locally, point all your requests to `http://localhost:3001`.  (i.e. Postman, Chrome, etc).

# Simulation Mode

The trading app will allow for simulation mode.  Simply switch the environment variable `SIMULATE` to either 0 or 1: 0 being off and 1 being on.  This will set the interface with the trading API websocket to be in simulation mode and all price updates will be based on a statistical normal distribution of random prices.  Bids, asks and lasts will simulate real-life conditions and follow real price action behaviors as close as possible.  Price for the simulation will be retrieved from the Yahoo YQL API.

If no `.env` variable is set for simulate mode, the application will default to simulate mode off.

## System Requirements
* NodeJS version 6.x and above
* NPM version 4.x and above
