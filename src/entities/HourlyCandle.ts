import { BigInt } from '@graphprotocol/graph-ts';
import { Price, HourlyCandle } from '../generated/schema';

export function aggregateHourlyCandle(price: Price): void {
  // check whether the price fits in an existing candle
  let openTimestamp = price.timestamp.minus(
    price.timestamp.mod(BigInt.fromI32(3600)),
  );

  let candleId = price.feed + '/' + openTimestamp.toString();
  let candle = HourlyCandle.load(candleId);

  if (!candle) {
    candle = new HourlyCandle(candleId);
    let closeTimestamp = openTimestamp.plus(BigInt.fromI32(3600));
    candle.feed = price.feed;
    candle.openTimestamp = openTimestamp;
    candle.closeTimestamp = closeTimestamp;
    candle.averagePrice = price.price;
    candle.openPrice = price.price;
    candle.closePrice = price.price;
    candle.highPrice = price.price;
    candle.lowPrice = price.price;
    candle.prices = [];
  }

  candle.prices = candle.prices.concat([price.id]);

  let prices = candle.prices.map<Price>((id) => Price.load(id) as Price);
  let sum = BigInt.fromI32(0);

  for (let i: i32 = 0; i < prices.length; i++) {
    sum = sum.plus(prices[i].price);
  }

  let average = sum.div(BigInt.fromI32(prices.length));

  candle.averagePrice = average;
  candle.closePrice = price.price;

  if (price.price.lt(candle.lowPrice)) {
    candle.lowPrice = price.price;
  }

  if (price.price.gt(candle.highPrice)) {
    candle.highPrice = price.price;
  }
  candle.save();
}
