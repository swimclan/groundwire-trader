## Overview

This is the area of the application that will be dedicated to functions that calculate the trailing stop loss and other mathmatical models that will support the strategies employed at Groundwire.

## File Layout

Each strategy function will be in its own file.  For instance a function that calculates the trailing stop loss value for the slope method will be in its own file called `slope.js`.  The file will simply export the anonymous function using Node's `module.exports` convention.

## Strategies Supported

| Strategy             | Description                                            |
| -------------------- | ------------------------------------------------------ |
| Profit Model         | This strategy will raise the stop loss differential based on the current positive profit margin |
|