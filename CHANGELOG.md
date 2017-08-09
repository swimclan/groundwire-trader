| Version              | Type      | Description                                                                                               |
| -------------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| **v1.15.0**          | *Feature* | Allowed for additional params to be sent to the position trade route for future user preferences portal.  |
| **v1.14.0**          | *Feature* | Allowed for position create to respond to post request with custom screener params.  Config is fallback.  |
| **v1.13.0**          | *Feature* | Added profit lock feature to specify a return margin that sets the stop loss to break even automatically  |
| **v1.12.2**          | *Update*  | Added a chain cert in the request config for certifacate authorities on production.                       |
| **v1.12.1**          | *Fix*     | Fixed the SSL capability of the server.  Ensuring that all requests made to the api are made by qualified ssl certificate. |
| **v1.12.0**          | *Feature* | Added holiday awareness in checking for the last weekday when searching for eligible positions to trade   |
| **v1.11.0**          | *Feature* | Implemented MSN stock sceener for automated stock picks                                                   |
| **v1.10.3**          | *Feature* | Made analytics enabling a configurable feature                                                            |
|                      | *Fix*     | Fixed price rounding for allocating balance for position create                                           |
| **v1.10.2**          | *Fix*     | Fixed log file name resolution for all hosts                                                              |
| **v1.10.1**          | *Feature* | Introduced robust logging utilities                                                                       |
| **v1.9.3**           | *Feature* | Ability to be aware of what positions were acquired over one trading day ago so as not to disturb already-tracked positions for a multi-day swing trade. |
| **v1.9.2**           | *Feature* | Support child collections in the Model class library                                                      |
| **v1.9.1**           | *Feature* | Support holiday calendar to prevent buying and selling on posted market holidays                          |
| **v1.9.0**           | *Feature* | Supported the best price stop loss strategy. [Read about the best price model](./strategies/README.md)    |
| **v1.8.2**           | *Fix*     | Fixed bug where error happened on position create when watchlist was empty                                |
| **v1.8.1**           | *Feature* | Put strategy label on file name of Google Sheet log file                                                  |
| **v1.8.0**           | *Feature* | Added GitLab Continuous Integration with Docker containers                                                |
| **v1.7.1**           | *Feature* | Added a data logger that integrates with Google drive to analyze the strategies                           |
| **v1.7.0**           | *Feature* | Added ability to have app automatically determine how many shares of each stock to buy in watch list based on buying power in specified account |
| **v1.6.1**           | *Feature* | Support child models in the model class to have "sub objects" in the data from the API                    |
| **v1.6.0**           | *Feature* | Provided the profit model stop loss strategy in the trading feature.  Ability to track overall profit and dictate stop loss margin based on it. [Read about the slope model](./strategies/README.md) |
| **v1.5.2**           | *Fix*     | Fixed it so that all sell orders are market sell orders and not stop sell to reduce rejection probability |
| **v1.5.1**           | *Feature* | Supporting SSL certificate and making the path to the SSL files configurable                              |
| **v1.5.0**           | *Feature* | Ability for the trading controller to execute sell order when stop loss value is hit by the best ask price |
| **v1.4.1**           | *Fix*     | Fixed a bug where the simulator was not logging the correct mode on or off                                |
| **v1.4.0**           | *Feature* | Ability to track multiple stocks on multiple sockets at once.  Allows user to have many positions in the market simultaneously |
| **v1.3.1**           | *Fix*     | Fixed a bug where simulation mode was not defaulting to off when no environment variable was set |
| **v1.3.0**           | *Feature* | Introduced the Slope Model stop-loss strategy in the trading feature.  Ability to track a price stream for a single stock in the watch list and track the price changes with a trailing stop loss that follows the slope model.  [Read about the slope model](./strategies/README.md) here. |
| **v1.2.5**           | *Feature* | Configurable bid/ask spread-tolerance to be able to tune the followed price as close as possible to Robinhood app |
| **v1.2.0**           | *Feature* | Support for enabling price stream simulations from the API to be able to test strategies against test data. |
| **v1.1.1**           | *Feature* | Ability to exclude symbols from tradeable tickers on the stream |
| **v1.1.0**           | *Feature* | Ability to connect to GroundWire price socket |
| **v1.0.0**           | *Feature* | Initial version of the trading application.  Will purchase *n* user-specified shares for each valid stock in their RH watch list. |