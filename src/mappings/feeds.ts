import { AnswerUpdated, NewRound } from '../generated/AggregatorInterface';
import { ensurePriceFeed } from '../entities/PriceFeed';
import { Price } from '../generated/schema';
import { aggregateHourlyCandle } from '../entities/HourlyCandle';

export function handleAnswerUpdatedForPair(
  pair: string,
  event: AnswerUpdated,
): void {
  let feed = ensurePriceFeed(pair);
  feed.latestTimestamp = event.params.timestamp;
  feed.latestPrice = event.params.current;
  feed.save();

  let id =
    event.address.toHex() +
    '/' +
    event.block.number.toString() +
    '/' +
    event.logIndex.toString();

  let price = new Price(id);
  price.feed = feed.id;
  price.price = event.params.current;
  price.timestamp = event.params.timestamp;
  price.round = event.params.roundId;
  price.save();

  aggregateHourlyCandle(price);
}

export function handleNewRoundForPair(pair: string, event: NewRound): void {
  // TODO: Do this later.
}
