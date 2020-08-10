import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { PriceFeed, Price } from '../generated/schema';

export function ensurePriceFeed(
  event: ethereum.Event,
  pair: string,
): PriceFeed {
  let id = event.address.toHex();
  let feed = PriceFeed.load(id) as PriceFeed;
  if (feed) {
    return feed;
  }

  feed = new PriceFeed(id);
  feed.assetPair = pair;
  feed.latestPrice = BigInt.fromI32(0);
  feed.latestPriceTimestamp = BigInt.fromI32(0);
  feed.latestPriceRef = '';
  feed.save();

  return feed;
}

export function updatePriceFeed(feed: PriceFeed, price: Price): PriceFeed {
  feed.latestPrice = price.price;
  feed.latestPriceTimestamp = price.timestamp;
  feed.latestPriceRef = price.id;
  feed.save();

  return feed;
}
