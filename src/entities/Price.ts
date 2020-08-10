import { Price, PriceFeed } from '../generated/schema';
import { AnswerUpdated } from '../generated/AggregatorInterface';
import { ensurePriceFeed, updatePriceFeed } from './PriceFeed';

export function priceId(event: AnswerUpdated): string {
  let address = event.address.toHex();
  let block = event.block.number.toString();
  let log = event.logIndex.toString();
  return address + '/' + block + '/' + log;
}

export function latestPrice(feed: PriceFeed): Price | null {
  return Price.load(feed.latestPriceRef);
}

export function createPrice(event: AnswerUpdated, feed: PriceFeed): Price {
  let id = priceId(event);
  let price = new Price(id);
  price.blockNumber = event.block.number;
  price.blockHash = event.block.hash.toHex();
  price.transactionHash = event.transaction.hash.toHex();
  price.assetPair = feed.assetPair;
  price.priceFeed = feed.id;
  price.isLatest = true;
  price.timestamp = event.params.timestamp;
  price.price = event.params.current;
  price.save();

  return price;
}

export function maintainLatestPrice(event: AnswerUpdated, pair: string): Price {
  let feed = ensurePriceFeed(event, pair);
  let previous = latestPrice(feed);

  // Update the 'isLatest' flag on the previous price.
  if (previous) {
    previous.isLatest = false;
    previous.save();
  }

  let price = createPrice(event, feed);
  updatePriceFeed(feed, price);

  return price;
}
