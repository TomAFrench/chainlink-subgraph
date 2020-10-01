import { updateAggregates } from '../entities/Aggregate';
import { updateDailyCandle, updateHourlyCandle, updateWeeklyCandle } from '../entities/Candle';
import { createPrice } from '../entities/Price';
import { ensurePriceFeed } from '../entities/PriceFeed';
import { AnswerUpdated, NewRound } from '../generated/AggregatorInterface';

export function handleAnswerUpdatedForPair(pair: string, event: AnswerUpdated): void {
  updateAggregates(event);

  let feed = ensurePriceFeed(event, pair);
  let price = createPrice(event, feed);

  let hourly = updateHourlyCandle(price);
  let daily = updateDailyCandle(price);
  let weekly = updateWeeklyCandle(price);

  feed.latestPrice = price.id;
  feed.latestHourlyCandle = hourly.id;
  feed.latestDailyCandle = daily.id;
  feed.latestWeeklyCandle = weekly.id;
  feed.save();
}

export function handleNewRoundForPair(pair: string, event: NewRound): void {
  // TODO: Do this later.
}
