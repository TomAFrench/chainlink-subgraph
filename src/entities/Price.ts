import { BigInt } from '@graphprotocol/graph-ts';
import { AnswerUpdated } from '../generated/AggregatorInterface';
import { Price, PriceFeed } from '../generated/schema';
import { logCritical } from '../utils/logCritical';
import { usePriceFeed } from './PriceFeed';

export function priceId(event: AnswerUpdated): string {
  let address = event.address.toHex();
  let block = event.block.number.toString();
  let log = event.logIndex.toString();
  return address + '/' + block + '/' + log;
}

export function createPrice(event: AnswerUpdated, feed: PriceFeed): Price {
  let previous: Price | null = feed.latestPrice != '' ? usePrice(feed.latestPrice) : null;
  let deviation: BigInt | null = null;

  if (previous != null) {
    let difference = event.params.current.minus(previous.price);
    deviation = difference.times(BigInt.fromI32(100)).div(previous.price);
  }

  let id = priceId(event);
  let price = new Price(id);
  price.blockNumber = event.block.number;
  price.blockHash = event.block.hash.toHex();
  price.transactionHash = event.transaction.hash.toHex();
  price.assetPair = feed.assetPair;
  price.priceFeed = feed.id;
  price.timestamp = event.params.updatedAt;
  price.price = event.params.current;
  price.priceDeviation = deviation;
  price.previousPrice = previous != null ? previous.id : null;
  price.timeSincePreviousPrice = previous != null ? price.timestamp.minus(previous.timestamp) : null;
  price.save();

  return price;
}

export function usePrice(id: string): Price {
  let price = Price.load(id) as Price;
  if (price == null) {
    logCritical('price {} does not exist', [id]);
  }
  return price;
}
