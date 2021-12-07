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
 * @param container - id of HTML element or element itself
 * @param options - any subset of ChartOptions to be applied at start.
 * @returns an interface to the created chart
 */
export function createChart(container: HTMLElement, options:Ioptions){  
    const chartCanvas = document.createElement('canvas');
    chartCanvas.className = 'chart-canvas';
  
    const scaleCanvas = document.createElement('canvas');
    scaleCanvas.className = 'chart-canvas-scale';
  
    container.className = 'chart';
    container.appendChild(chartCanvas);
    container.appendChild(scaleCanvas);

    return new ChartApi(container, options);
  }