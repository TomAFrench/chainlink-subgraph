import { AnswerUpdated, NewRound } from '../generated/AggregatorInterface';
import { maintainLatestPrice } from '../entities/Price';
import { updateHourlyCandle, updateDailyCandle } from '../entities/Candles';

export function handleAnswerUpdatedForPair(
  pair: string,
  event: AnswerUpdated,
): void {
  let price = maintainLatestPrice(event, pair);

  updateHourlyCandle(price);
  updateDailyCandle(price);
}

export function handleNewRoundForPair(pair: string, event: NewRound): void {
  // TODO: Do this later.
}
