import { AnswerUpdated, NewRound } from '../generated/AggregatorInterface';
import {
  updateHourlyCandle,
  updateDailyCandle,
  createMissingDailyCandles,
  createMissingHourlyCandles,
  Candle,
} from '../entities/Candles';
import { ensurePriceFeed } from '../entities/PriceFeed';
import { createPrice } from '../entities/Price';

export function handleAnswerUpdatedForPair(
  pair: string,
  event: AnswerUpdated,
): void {
  let feed = ensurePriceFeed(event, pair);
  let price = createPrice(event, feed);
  let hourly = updateHourlyCandle(price);
  let daily = updateDailyCandle(price);

  createMissingHourlyCandles(feed, hourly as Candle);
  createMissingDailyCandles(feed, daily as Candle);

  feed.latestPrice = price.id;
  feed.latestHourlyCandle = hourly.id;
  feed.latestDailyCandle = daily.id;
  feed.save();
}

export function handleNewRoundForPair(pair: string, event: NewRound): void {
  // TODO: Do this later.
}
