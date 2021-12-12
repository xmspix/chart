import { relativeFontSize } from "../helpers/chartTools";
import { toScreen } from "../helpers/coordinates";

export default function scale(view:any, quotes:any, priceLines:any, timeLines:any, cursorData:any) {
  const priceBox = view.geometry.boxPrice.padding;

  drawPriceScale(view.crosshairCtx, priceLines, quotes, view, cursorData);
  drawTimeScale(view.crosshairCtx, priceBox, timeLines, view);
}

function drawPriceScale(ctx:any, scaleValues:any, quotes:any, chartView:any, cursorData:any) {
  const priceBox = chartView.geometry.boxPrice.padding;
  const priceBoxContent = chartView.geometry.boxPrice.content;
  const style = chartView.style;
  const fontSize = relativeFontSize(chartView.width,chartView.height,chartView.fontSize,chartView.devicePixelRatio);
  const ratio = priceBoxContent[3] / quotes.range;

  for (const scaleValue of scaleValues) {
    const screenY = priceBoxContent[0] + priceBoxContent[3] - (scaleValue - quotes.min) * ratio;

    ctx.strokeStyle = style.colorScale;
    ctx.beginPath();
    ctx.moveTo(priceBox[0] + priceBox[2], screenY);
    ctx.lineTo(priceBox[0] + priceBox[2] + chartView.config.padding, screenY);
    ctx.stroke();

    let atCursor = false;
    if (cursorData) {
      const cursorY = toScreen(cursorData[1],priceBoxContent[3],quotes.min,quotes.max);
      if (cursorY > screenY - 2 * fontSize && cursorY < screenY) {
        atCursor = true;
      }
    }

    if (!atCursor) {
      ctx.fillStyle = style.colorScale;
      ctx.font = `${fontSize}px "Arial"`;
      ctx.fillText(
        scaleValue,
        priceBox[0] + priceBox[2] + chartView.config.padding * 2,
        screenY + fontSize / 3
      );
    }
  }
}

function drawTimeScale(ctx:any, boxPrice:any, scaleValues:any, chartView:any) {
  const style = chartView.style;
  const fontSize = relativeFontSize(chartView.width,chartView.height,chartView.fontSize,chartView.devicePixelRatio);
  let previousLabelX = Number.MAX_SAFE_INTEGER;
  for (let i = scaleValues.length - 1; i > 0; --i) {
    const verticalLine = scaleValues[i];
    ctx.strokeStyle = style.colorGrid;
    const drawingStickBegin = boxPrice[0] + (verticalLine[0] + 0.5) * chartView.stickLength;

    ctx.fillStyle = style.colorScale;
    ctx.font = `${fontSize}px "Arial"`;

    const labelWidth = ctx.measureText(verticalLine[1]).width;

    // prevent drawing labels on top each other
    if (drawingStickBegin + labelWidth < previousLabelX) {
      ctx.fillText(verticalLine[1],drawingStickBegin,boxPrice[0] + boxPrice[3] + fontSize);
    }

    previousLabelX = drawingStickBegin;
  }
}
