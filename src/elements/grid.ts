export default function grid(view:any, quotes:any, priceLines:any, timeLines:any) {
  drawPriceGrid(view.ctx, priceLines, quotes.min, quotes.range, view);
  drawTimeGrid(view.ctx, timeLines, view);
}

function drawPriceGrid(ctx:any, scaleValues:any, priceMin:any, priceRange:any, chartView:any) {
  const priceBox = chartView.geometry.boxPrice.padding;
  const priceBoxContent = chartView.geometry.boxPrice.content;
  const style = chartView.style;
  const ratio = priceBoxContent[3] / priceRange;

  for(let scaleValue of scaleValues) {
    const screenY = priceBoxContent[0] + priceBoxContent[3] - (scaleValue - priceMin) * ratio;

    ctx.strokeStyle = style.colorGrid;
    ctx.beginPath();
    ctx.moveTo(priceBox[0], screenY);
    ctx.lineTo(priceBox[0] + priceBox[2], screenY);
    ctx.stroke();
  }
}

function drawTimeGrid(ctx:any, scaleValues:any, chartView:any) {
  const boxPrice = chartView.geometry.boxPrice.padding;
  const boxVolume = chartView.geometry.boxVolume ? chartView.geometry.boxVolume.padding : null;

  const style = chartView.style;

  for(let i = 0; i < scaleValues.length; ++i) {
    let verticalLine = scaleValues[i];
    ctx.strokeStyle = style.colorGrid;
    const drawingStickBegin = boxPrice[0] + (verticalLine[0] + 0.5) * chartView.stickLength;
    ctx.beginPath();
    ctx.moveTo(drawingStickBegin, boxPrice[1]);
    if (boxVolume) {
      ctx.lineTo(drawingStickBegin, boxVolume[1] + boxVolume[3]);
    } else {
      ctx.lineTo(drawingStickBegin, boxPrice[1] + boxPrice[3]);
    }
    ctx.stroke();
  }
}
