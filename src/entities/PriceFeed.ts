import { BigInt } from '@graphprotocol/graph-ts';
import { PriceFeed } from '../generated/schema';

export function ensurePriceFeed(pair: string): PriceFeed {
  let feed = PriceFeed.load(pair) as PriceFeed;
  if (feed) {
    return feed;
  }

  feed = new PriceFeed(pair);
  feed.latestPrice = BigInt.fromI32(0);
  feed.latestTimestamp = BigInt.fromI32(0);
  feed.latestRound = BigInt.fromI32(0);
  feed.save();

  return feed;
}
