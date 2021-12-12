import React, { useRef, useLayoutEffect } from "react";
import { createChart } from "@xmspix/chart";
import getData from "./data";

function App() {
  const chartContainer = useRef<HTMLDivElement>(null!);

  useLayoutEffect(() => {
    const chart = createChart(chartContainer.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      watermark: {
        text: '@xmspix/chart',
        color: 'rgba(0, 0, 0, 0.2)',
        fontSize: '60px',
        fontFamily: 'sans-serif',
    }
    });

    chart.addCandlestickSeries(getData());

    console.log(chart);
  });

  return <div className="App" ref={chartContainer}></div>;
}

export default App;
