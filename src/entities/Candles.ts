import { BigInt, Entity, Value, store } from '@graphprotocol/graph-ts';
import { Price, HourlyCandle, DailyCandle } from '../generated/schema';
import { calculateAverage, calculateMedian } from '../utils/math';

export function updateHourlyCandle(price: Price): HourlyCandle {
  return updateCandle('HourlyCandle', 3600, price) as HourlyCandle;
}

export function updateDailyCandle(price: Price): DailyCandle {
  return updateCandle('DailyCandle', 86400, price) as DailyCandle;
}

export function updateCandle(type: string, length: i32, price: Price): Candle {
  // Calculate hourly buckets for the open timestamp.
  let openTimestampExcess = price.timestamp.mod(BigInt.fromI32(length));
  let openTimestamp = price.timestamp.minus(openTimestampExcess);
  let closeTimestamp = openTimestamp.plus(BigInt.fromI32(length));

  // Use the calculated open timestamp to create the id of the candle
  // and either load the already existing candle or create a new one.
  let id = price.priceFeed + '/' + openTimestamp.toString();
  let candle = Candle.load(type, id);

  if (!candle) {
    candle = new Candle(id);
    candle.assetPair = price.assetPair;
    candle.priceFeed = price.priceFeed;
    candle.openTimestamp = openTimestamp;
    candle.closeTimestamp = closeTimestamp;
    candle.averagePrice = price.price;
    candle.medianPrice = price.price;
    candle.openPrice = price.price;
    candle.closePrice = price.price;
    candle.highPrice = price.price;
    candle.lowPrice = price.price;
    candle.includedPrices = [price.id];
  } else {
    candle.includedPrices = candle.includedPrices.concat([price.id]);

    let prices = candle.includedPrices.map<BigInt>(
      (id) => Price.load(id).price,
    );

    candle.averagePrice = calculateAverage(prices);
    candle.averagePrice = calculateMedian(prices);
    candle.closePrice = price.price;

    if (price.price.lt(candle.lowPrice)) {
      candle.lowPrice = price.price;
    }

    if (price.price.gt(candle.highPrice)) {
      candle.highPrice = price.price;
    }
  }

  candle.save(type);

  return candle as Candle;
}

export class Candle extends Entity {
  constructor(id: string) {
    super();
    this.set('id', Value.fromString(id));
  }

  save(type: string): void {
    store.set(type, this.get('id').toString(), this);
  }

  static load(type: string, id: string): Candle | null {
    return store.get(type, id) as Candle | null;
  }

  get id(): string {
    let value = this.get('id');
    return value.toString();
  }

  set id(value: string) {
    this.set('id', Value.fromString(value));
  }

  get priceFeed(): string {
    let value = this.get('priceFeed');
    return value.toString();
  }

  set priceFeed(value: string) {
    this.set('priceFeed', Value.fromString(value));
  }

  get assetPair(): string {
    let value = this.get('assetPair');
    return value.toString();
  }

  set assetPair(value: string) {
    this.set('assetPair', Value.fromString(value));
  }

  get openTimestamp(): BigInt {
    let value = this.get('openTimestamp');
    return value.toBigInt();
  }

  set openTimestamp(value: BigInt) {
    this.set('openTimestamp', Value.fromBigInt(value));
  }

  get closeTimestamp(): BigInt {
    let value = this.get('closeTimestamp');
    return value.toBigInt();
  }

  set closeTimestamp(value: BigInt) {
    this.set('closeTimestamp', Value.fromBigInt(value));
  }

  get averagePrice(): BigInt {
    let value = this.get('averagePrice');
    return value.toBigInt();
  }

  set averagePrice(value: BigInt) {
    this.set('averagePrice', Value.fromBigInt(value));
  }

  get medianPrice(): BigInt {
    let value = this.get('medianPrice');
    return value.toBigInt();
  }

  set medianPrice(value: BigInt) {
    this.set('medianPrice', Value.fromBigInt(value));
  }

  get openPrice(): BigInt {
    let value = this.get('openPrice');
    return value.toBigInt();
  }

  set openPrice(value: BigInt) {
    this.set('openPrice', Value.fromBigInt(value));
  }

  get closePrice(): BigInt {
    let value = this.get('closePrice');
    return value.toBigInt();
  }

  set closePrice(value: BigInt) {
    this.set('closePrice', Value.fromBigInt(value));
  }

  get lowPrice(): BigInt {
    let value = this.get('lowPrice');
    return value.toBigInt();
  }

  set lowPrice(value: BigInt) {
    this.set('lowPrice', Value.fromBigInt(value));
  }

  get highPrice(): BigInt {
    let value = this.get('highPrice');
    return value.toBigInt();
  }

  set highPrice(value: BigInt) {
    this.set('highPrice', Value.fromBigInt(value));
  }

  get includedPrices(): Array<string> {
    let value = this.get('includedPrices');
    return value.toStringArray();
  }

  set includedPrices(value: Array<string>) {
    this.set('includedPrices', Value.fromStringArray(value));
  }
}
