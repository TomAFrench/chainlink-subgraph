import { updateAggregates } from '../entities/Aggregate';
import { createPrice } from '../entities/Price';
import { ensurePriceFeed } from '../entities/PriceFeed';
import { AnswerUpdated, NewRound } from '../generated/AggregatorInterface';

export function handleAnswerUpdatedForPair(pair: string, event: AnswerUpdated): void {
  updateAggregates(event);
  createPrice(event, ensurePriceFeed(event, pair));
}

export function handleNewRoundForPair(pair: string, event: NewRound): void {
  // TODO: Do this later.
}
