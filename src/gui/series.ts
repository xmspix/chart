import { toScreen } from '../helpers/coordinates';

export default function LineSeries(view: any, seriesQuotes: any, priceQuotes: any, lineSeries: any, viewModel: any) {
    seriesQuotes.map((seriesQuotes: any, x: any) => {
        const minTimestamp = priceQuotes.data[0].timestamp;
        const maxTimestamp = priceQuotes.data[priceQuotes.data.length - 1].timestamp;

        const minQouteIndex = seriesQuotes.findIndex((e: any) => e.timestamp === minTimestamp);
        const maxQouteIndex = seriesQuotes.findIndex((e: any) => e.timestamp === maxTimestamp);

        const newQoute = seriesQuotes.slice(minQouteIndex, maxQouteIndex);

        const box = view.geometry.boxPrice.padding;
        const boxContent = view.geometry.boxPrice.content;

        view.ctx.strokeStyle = view.style.colorBorder;
        view.ctx.strokeRect(...box);

        const quotesLength = newQoute.length;
        const q = { ...priceQuotes, data: newQoute };

        for (let i = 0; i < quotesLength; ++i) {
            drawLine(view.ctx, q, i, boxContent, view.stickLength, lineSeries[x]);
        }
    })
}


function drawLine(ctx:any, quotes:any, i:any, boxContent:any, stickLength:any, style:any) {
    const xStart = boxContent[0] + i * stickLength;
    let xEnd = boxContent[0] + (i + 1) * stickLength;
    const q = quotes.data;
    const c = q[i].c;
    const prevC = i === 0 ? q[i].o : q[i - 1].c;

    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.lineWidth;
    ctx.beginPath();
    ctx.moveTo(
      xStart,
      toScreen(prevC, boxContent[3], quotes.min, quotes.max) + boxContent[1]
    );
    ctx.lineTo(
      xEnd,
      toScreen(c, boxContent[3], quotes.min, quotes.max) + boxContent[1]
    );
    ctx.stroke();
  }