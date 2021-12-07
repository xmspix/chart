/**
 * Calculate human-readable price scale matching prace range
 */
export function humanScalePrice(priceRange:any) {
  const ranges = [];
  for(let i = 1; i < 10; i++) {
    const powerOfTen = Math.pow(10, i);
    ranges.push(powerOfTen / 4 / 1000);
    ranges.push(powerOfTen / 2 / 1000);
    ranges.push(powerOfTen / 1000);
  }

  const scaleValue = priceRange / 8;
  let humanScaleDiff = 100000000;
  let humanScale = 0;
  for(let range of ranges) {
    const diff = Math.abs(scaleValue - range);
    if (humanScaleDiff > diff) {
      humanScaleDiff = diff;
      humanScale = range;
    }
  }
  return humanScale;
}


export function formatPrice(price:any) {
  let unit = '';

  if (price > 999999) {
    price /= 1000000;
    unit = 'M';
  } else if (price > 9999) {
    price /= 1000;
    unit = 'K';
  }

  return price + unit;
}

export function dateToTimeScale(date:any, rangeMilliseconds:any, localeData:any) {
  const month = 2678400000;
  const year = 31536000000;

  let result;
  if (rangeMilliseconds > year) {
    result = date.getFullYear();
  } else if (rangeMilliseconds > month) {
    result = localeData.monthNames[date.getMonth()];
    if (date.getMonth() === 0) {
      result += ' ' + date.getFullYear();
    }
  } else {
    result = date.getDate() + ' ' + localeData.monthNames[date.getMonth()];
  }

  return result;
}

/**
 * Point inside box check
 */
export function inside(point:any, box:any) {
  return (
    point[1] > box[1] && point[1] < (box[1] + box[3]) &&
    point[0] > box[0] && point[0] < (box[0] + box[2])
  );
}

export function relativeFontSize(width:any, height:any, maxSize:any, devicePixelRatio:any) {
  const size = width / 30;
  return Math.min(maxSize, size);
}
