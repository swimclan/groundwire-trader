# Overview
This is the GroundWire trading application.  It is a server that is configured to execute trades according to various built-in strategies.  Once positions are generated, the server will monitor price action using the Intrinio&trade; Real-Time Exchange websocket stream and implement a trailing stop loss for each stock position that it is configured to manage. The trailing stop loss algorithm is configurable to be less or more agressive in terms of price tracking so as to be intelligent about how to lock in profit margin or minimize loss.

# Version
1.0.0
<br>
<em>See</em> [`CHANGELOG.md`](./CHANGELOG.md) <em>for more detailed view of all versions</em>

# Routes

| Route                          | Description                                                           |
| ------------------------------ | --------------------------------------------------------------------- |
| `/position/create/:quantity`   | This route when requested will kick off the purchasing of all instruments that are in the user's watch list.  Only tradeable instruments will be bought.  Orders with untradeable insrtuments will simply not be filled. |
|                                |                                                                       |

# Security

Username and password for the target Robinhood account must be stored as an environment variable on the server that is hosting the trading application.  The environment variables take the form:

```
USERNAME=username
PASSWORD=password
```

Where `username` and `password` are the username and password of the user's target Robinhood account.  

Also, a required `API_KEY` must be present as an environment variable also.  This key is the target key for accessing the Groundwire trading API.  See [documentation for GroundWire Trading API](https://gitlab.com/ground_wire/node_repo/blob/master/README.md) for more information.

# Environments

There are currently two environments that are supported in the trading app: (1) `development` and (2) `production`.  The specified environment must be defined as an environment variable using the key `NODE_ENV`.  If `development` is specified, all calls to the trading API will be made locally which means that you must have a locally running version of the GroundWire trading API.  If `production` is specified on `NODE_ENV` then all calls to the trading API will be made to the production endpoint at `groundwire.co/api`. 

# Running Locally

This application can be run locally on your development computer.  Simply clone down the repo, set the appropriate environent variables in the `.env` file and run it with `npm start`.

After running the server locally, point all your requests to `http://localhost:3001`.  (i.e. Postman, Chrome, etc).

## System Requirements
* NodeJS version 6.x and above
* NPM version 4.x and above
