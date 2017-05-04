| Version              | Type      | Description                                                                                               |
| -------------------- | --------- | --------------------------------------------------------------------------------------------------------- |
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