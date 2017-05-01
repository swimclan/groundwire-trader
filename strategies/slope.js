module.exports = function(lastPrice, currentPrice, lastStop, coefficient, minStopMargin) {
    let priceSlope = currentPrice - lastPrice;
    let stopSlope = coefficient * priceSlope;
    let stopMarginCheck = (currentPrice - (stopSlope + lastStop)) / currentPrice;

    return (priceSlope > 0) && (stopMarginCheck > minStopMargin) ? stopSlope + lastStop : lastStop;
}
