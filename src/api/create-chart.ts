import {ChartApi} from './chart-api';

import {WatermarkOptions} from '../gui/watermark';

export interface Ioptions {
    width: number;
    height: number;
    zoom: number;
    offset: number;
    config: Iconfig;
    theme: {};
    watermark: WatermarkOptions;
}

export interface Iconfig {
    chartType: any;
    locale: any;
    stickMargin: any;
    fontSize: any;
    geometry: any;
}

/**
 * This function is the main entry point of the Lightweight Charting Library
 *
 * @param container - HTML element that will contain the chart
 * @param options - any subset of ChartOptions to be applied at start.
 * @returns an interface to the created chart
 */
export function createChart(container: HTMLElement, options:Ioptions){  
    const chartCanvas = document.createElement('canvas');
    chartCanvas.className = 'chart-canvas';
    chartCanvas.style.width = '100%';
    chartCanvas.style.height = '100vh';
    chartCanvas.style.position = 'absolute';
    chartCanvas.style.top = '0';
    chartCanvas.style.left = '0';
    chartCanvas.style.zIndex = '1';
  
    const scaleCanvas = document.createElement('canvas');
    scaleCanvas.className = 'chart-canvas-scale';
    scaleCanvas.style.width = '100%';
    scaleCanvas.style.height = '100vh';
    scaleCanvas.style.position = 'absolute';
    scaleCanvas.style.top = '0';
    scaleCanvas.style.left = '0';
    scaleCanvas.style.zIndex = '1';

    // const legendContainer = document.createElement('div');
    // legendContainer.className = 'legend';
    // legendContainer.style.display = 'block';
    // legendContainer.style.left = 3 + 'px';
    // legendContainer.style.top = 3 + 'px';
    // legendContainer.style.zIndex = '2';
    // legendContainer.style.position = 'absolute';
  
    container.className = 'chart';
    // container.appendChild(legendContainer);
    container.appendChild(chartCanvas);
    container.appendChild(scaleCanvas);

    return new ChartApi(container, options);
  }