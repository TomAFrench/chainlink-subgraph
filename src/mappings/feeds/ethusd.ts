import { handleAnswerUpdatedForPair, handleNewRoundForPair } from '../feeds';
import { AnswerUpdated, NewRound } from '../../generated/AggregatorInterface';

export function handleAnswerUpdated(event: AnswerUpdated): void {
  handleAnswerUpdatedForPair('ETH/USD', event);
}

export function handleNewRound(event: NewRound): void {
  handleNewRoundForPair('ETH/USD', event);
}
