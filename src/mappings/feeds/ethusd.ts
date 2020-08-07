import { AnswerUpdated, NewRound } from '../../generated/AggregatorInterface';
import { ensurePriceFeed } from '../../entities/PriceFeed';
import { Price } from '../../generated/schema';

export function handleAnswerUpdated(event: AnswerUpdated): void {
  let feed = ensurePriceFeed('ETH/USD');
  feed.latestTimestamp = event.params.timestamp;
  feed.latestPrice = event.params.current;
  feed.latestRound = event.params.roundId;
  feed.save();

  let id = event.address.toHex() + '/' + event.params.roundId.toString();
  let price = new Price(id);
  price.feed = feed.id;
  price.price = event.params.current;
  price.timestamp = event.params.timestamp;
  price.round = event.params.roundId;
  price.save();
}

export function handleNewRound(event: NewRound): void {
  // TODO: Do this later.
}
