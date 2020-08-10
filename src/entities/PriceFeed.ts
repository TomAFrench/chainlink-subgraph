import { ethereum } from '@graphprotocol/graph-ts';
import { PriceFeed } from '../generated/schema';

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
  feed.latestPrice = '';
  feed.latestHourlyCandle = '';
  feed.latestDailyCandle = '';

  return feed;
}
