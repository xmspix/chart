import { Quotes } from './quotes';
import { humanScalePrice, dateToTimeScale } from '../helpers/chartTools';

/**
 * View model data structure
 * It is the data of current chart view
 */
export interface View {
  quotes: any;
  cursorData: any;
  priceLines: any;
  timeLines: any;
  capacity: any;
}

export class View {
  constructor(){
    // Quotes model, contains all price data that is in current view
    this.quotes = null;
    // Data user cursor points to
    this.cursorData = null;
    // Values of the scale lines
    this.priceLines = null;
    this.timeLines = null;
  }

  preparePriceScale(min:any, max:any) {
    const humanScale = humanScalePrice(max - min);
  
    const scaleLines = [];
    for(let i = 0; i < max; i += humanScale) {
      if (i > min) {
        scaleLines.push(Math.round(i * 100) / 100);
      }
    }
    return scaleLines;
  }

  prepareTimeScale(quotes:any, localeData:any) {
    const min = new Date(new Date(quotes[0].timestamp*1000).toJSON().split('T')[0]).getTime();
    const max = new Date(new Date(quotes[quotes.length - 1].timestamp*1000).toJSON().split('T')[0]).getTime();
  
    const diff = max - min;
  
    const yScaleLines = [];
    let verticalUnit = null;
  
    for(let i = 0; i < quotes.length; ++i) {
      const newVerticalUnit = dateToTimeScale(new Date(new Date(quotes[i].timestamp*1000).toJSON().split('T')[0]), diff, localeData);
      if (newVerticalUnit !== verticalUnit) {
        yScaleLines.push([i, newVerticalUnit]);
      }
      verticalUnit = newVerticalUnit;
    }
    return yScaleLines;
  }

  initView(capacity:any, offset:any, quotes:any, locale:any) {
    const q = quotes.slice(-capacity + offset, Math.min(quotes.length, quotes.length + offset));
    this.quotes = new Quotes().quotesInit(q);
    this.cursorData = [null, null];
  
    // scale grid lines
    const localeData:any = {
      monthNames: []
    };
    for(let month = 0; month < 12; ++month) {
      const date = new Date();
      date.setTime(0);
      date.setMonth(month);
      const monthName = date.toLocaleString(locale, {
        month: "short"
      });
      localeData.monthNames.push(monthName);
    }

    this.capacity = capacity;
    this.priceLines = this.preparePriceScale(this.quotes.min, this.quotes.max);
    this.timeLines = this.prepareTimeScale(this.quotes.data, localeData);
  }

  getView() {
    return this;
  }
}