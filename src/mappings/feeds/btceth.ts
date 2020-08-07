import { AnswerUpdated, NewRound } from '../../generated/AggregatorInterface';
import { handleAnswerUpdatedForPair, handleNewRoundForPair } from '../feeds';

export function handleAnswerUpdated(event: AnswerUpdated): void {
  handleAnswerUpdatedForPair('BTC/ETH', event);
}

export function handleNewRound(event: NewRound): void {
  handleNewRoundForPair('BTC/ETH', event);
}

