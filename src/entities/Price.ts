import { Price, PriceFeed } from '../generated/schema';
import { AnswerUpdated } from '../generated/AggregatorInterface';

export function priceId(event: AnswerUpdated): string {
  let address = event.address.toHex();
  let block = event.block.number.toString();
  let log = event.logIndex.toString();
  return address + '/' + block + '/' + log;
}

export function createPrice(event: AnswerUpdated, feed: PriceFeed): Price {
  let id = priceId(event);
  let price = new Price(id);
  price.blockNumber = event.block.number;
  price.blockHash = event.block.hash.toHex();
  price.transactionHash = event.transaction.hash.toHex();
  price.assetPair = feed.assetPair;
  price.priceFeed = feed.id;
  price.timestamp = event.params.timestamp;
  price.price = event.params.current;
  price.save();

  return price;
}
