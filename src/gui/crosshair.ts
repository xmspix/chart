import { inside, relativeFontSize, formatPrice } from '../helpers/chartTools';
import { fromScreen } from '../helpers/coordinates';

export default function crosshair(view:any, quotes:any, cursorData:any, cursor:any, serriesData?:any) {
  const [x, y] = cursor;

  const boxPricePadding = view.geometry.boxPrice.padding;
  const boxVolumePadding = view.geometry.boxVolume ? view.geometry.boxVolume.padding : null;

  const insidePrice = inside(cursor, boxPricePadding);
  const insideVolume = boxVolumePadding ? inside(cursor, boxVolumePadding) : false;
  if (!insidePrice && !insideVolume) return [null, null];

  drawCrosshair(view.crosshairCtx, x, y, boxPricePadding, boxVolumePadding, view, cursorData);

  return getCursorData(view, cursor, quotes, serriesData);
}

function getCursorData(view:any, cursor:any, quotes:any, seriesQuotes?:any) {
  const [x, y] = cursor;
  const boxPrice = view.geometry.boxPrice.content;
  const boxPricePadding = view.geometry.boxPrice.padding;
  const boxVolume = view.geometry.boxVolume ? view.geometry.boxVolume.content : null;
  const boxVolumePadding = view.geometry.boxVolume ? view.geometry.boxVolume.padding : null;

  const insidePrice = inside(cursor, boxPricePadding);
  const insideVolume = boxVolumePadding ? inside(cursor, boxVolumePadding) : false;
  let yValue;
  if (insidePrice) {
    yValue = fromScreen(y - boxPrice[1], boxPrice[3], quotes.min, quotes.max);
  } else if (insideVolume) {
    yValue = fromScreen(y - boxVolume[1], boxVolume[3], 0, quotes.maxVolume);
  }

  const stickNumber = Math.round((x - view.stickLength / 2 - boxPrice[0]) / (view.stickLength));

  const xValue = quotes.data[stickNumber] ? quotes.data[stickNumber] : null;

  const sValue = seriesQuotes ? seriesQuotes.map((s:any) => s.data[stickNumber] ? s.data[stickNumber] : null) : null;

  const eventData = [xValue,yValue,sValue];

  return eventData;
}

function drawCrosshair(ctx:any, x:any, y:any, boxPrice:any, boxVolume:any, chartView:any, cursorData:any) {
  const fontSize = relativeFontSize(chartView.width, chartView.height, chartView.fontSize, chartView.devicePixelRatio);
  const style = chartView.style;
  ctx.strokeStyle = style.colorCrosshair;
  ctx.beginPath();
  ctx.moveTo(x, boxPrice[1]);
  if (boxVolume) {
    ctx.lineTo(x, boxVolume[1] + boxVolume[3]);
  } else {
    ctx.lineTo(x, boxPrice[1] + boxPrice[3]);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(boxPrice[0], y);
  ctx.lineTo(boxPrice[0] + boxPrice[2],y);
  ctx.stroke();

  ctx.font = `${fontSize}px "Arial"`;

  const yValue = cursorData[1];

  const text = formatPrice(yValue);

  ctx.fillStyle = style.colorScale;
  ctx.fillText(text, boxPrice[0] + boxPrice[2] + chartView.config.padding * 2, y + fontSize / 3);
}
