/**
* Quotes Model
*/

export interface Quotes {
  data: Quote | null;
  min: number;
  max: number;
  range: number;
  minVolume: number;
  maxVolume: number;
  rangeVolume: number;
  lastChange: number;
  plugins: any;
}

export interface Quote {
  o: number;
  h: number;
  l: number;
  c: number;
  volume: number;
}

export class Quotes {
  constructor() {
    /**
     * An array of price data series in following format:
     * {symbol, o, h, l, c, date, volume}
     */
    this.data = null;
    // Minimum and maximum values
    this.min = 1000000.0;
    this.max = 0.0;
    this.range = 0.0;
    this.minVolume = 1000000.0;
    this.maxVolume = 0.0;
    this.rangeVolume = 0.0;
    // Last change (open price - close price)
    this.lastChange = 0.0;
    // Some extra data calculated from 'data' field
    this.plugins = {};
  }

  quotesInit(quotesData: any) {
    this.data = quotesData;

    for (let quote of quotesData) {
      if (quote.h > this.max) this.max = quote.h;
      if (quote.l < this.min) this.min = quote.l;
      if (quote.volume > this.maxVolume) this.maxVolume = quote.volume;
      if (quote.volume < this.minVolume) this.minVolume = quote.volume;
    }

    this.range = this.max - this.min;
    this.rangeVolume = this.maxVolume - this.minVolume;

    this.lastChange =
      (quotesData[quotesData.length - 1].c - quotesData[quotesData.length - 2].c)
      / quotesData[quotesData.length - 2].c;

    this.lastChange = Math.round(this.lastChange * 10000) / 100;

    this.plugins.dailyChange = this.pluginInitDailyChange(this.data);
    this.plugins.variance = this.pluginInitVariance(this.data);
    return this;
  }

  pluginInitDailyChange(quotes: any) {
    const data = {
      min: 1000000.0,
      max: 0,
      avg: 0,
      minDate: null,
      maxDate: null,
    }

    let prevQuote = null;
    for (let quote of quotes) {
      const prevClose = prevQuote ? prevQuote.c : quote.o;
      const change = (quote.c - prevClose) / prevClose;
      data.avg += Math.abs(change);
      if (data.min > change) {
        data.min = change;
        data.minDate = quote.date;
      }
      if (data.max < change) {
        data.max = change;
        data.maxDate = quote.date;
      }
      prevQuote = quote;
    }

    data.avg = Math.round(data.avg / quotes.length * 10000) / 100;
    data.min = Math.round(data.min * 10000) / 100;
    data.max = Math.round(data.max * 10000) / 100;

    return data;
  }

  pluginInitVariance(quotes: any) {
    function calculateVariance(quote: any, prevQuote: any) {
      const prevClose = prevQuote ? prevQuote.c : quote.o;

      const diff1 = Math.abs(prevClose - quote.h);
      const diff2 = Math.abs(prevClose - quote.l);
      return Math.max(diff1, diff2);
    }

    const data = {
      min: 1000000.0,
      max: 0,
      avg: 0,
      minDate: null,
      maxDate: null,
    }

    let prevQuote = null;
    for (let quote of quotes) {
      let variance = calculateVariance(quote, prevQuote);
      data.avg += variance;
      if (data.min > variance) {
        data.min = variance;
        data.minDate = quote.date;
      }
      if (data.max < variance) {
        data.max = variance;
        data.maxDate = quote.date;
      }

      prevQuote = quote;
    }

    data.avg = Math.round(data.avg / quotes.length * 100) / 100;
    data.min = Math.round(data.min * 100) / 100;
    data.max = Math.round(data.max * 100) / 100;

    return data;
  }
}