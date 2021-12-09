import { Ioptions, Iconfig } from './create-chart';
import { View } from "../model/view";
import { Pane } from '../model/pane'
import price from "../gui/price";
import grid from "../gui/grid";
import volume from "../gui/volume";
import scale from "../gui/scale";
import crosshair from "../gui/crosshair";
import { SeriesApi } from './series-api';

export interface ChartApi {
  container: HTMLElement;
  options: Ioptions;
  quotes: any[];
  chartView: IchartView;
  cursor: any[];
  viewModel: any;
  lineSeries: any[];
  lineSeriesData: any[];
}

export interface IchartView {
  ctx: any;
  crosshairCtx: any;
  width: any;
  height: any;
  devicePixelRatio: any;
  style: any;
  config: Iconfig;
  geometry: any;
  chartType: any;
  stickLength: any;
  stickMargin: any;
  offset: any;
  fontSize: any;
  locale: any;
  options: any;
}

import defaultConfig from "../config/defaultConfig";
import themes from "../config/themes";
import watermark from '../gui/watermark';


export function chartThemes() {
  return themes;
}

export function chartDefaultConfig() {
  const config: any = { ...defaultConfig };
  config.geometry = {};
  config.geometry.boxPrice = { ...defaultConfig.geometry.boxPrice };
  config.geometry.boxVolume = { ...defaultConfig.geometry.boxVolume };
  return config;
}

export class ChartApi {
  constructor(container: HTMLElement, options: Ioptions) {
    this.container = container;
    this.options = options;
    this.quotes = [];
    this.chartView = <IchartView>{};
    this.cursor = [];
    this.chartInit(options);
    this.lineSeries = [];
    this.lineSeriesData = [];
  }

  chartInit({ width, height, zoom=8, offset=0, config, theme }: Ioptions) {
    const canvasLayers: any = {
      base: document.querySelector('.chart-canvas'),
      scale: document.querySelector('.chart-canvas-scale')
    }

    const maxDimension = 8192;
    if (width > maxDimension || height > maxDimension) {
      throw new Error(`Maximum chart dimensions exceeded: [${width}x${height}]`);
    }

    this.cursor[0] = 0;
    this.cursor[1] = 0;

    const min = 2;
    const max = 13;
    if (zoom < min) zoom = min;
    if (zoom > max) zoom = max;

    const devicePixelRatio = window.devicePixelRatio;
    canvasLayers.base.width = width * devicePixelRatio;
    canvasLayers.base.height = height * devicePixelRatio;
    canvasLayers.scale.width = width * devicePixelRatio;
    canvasLayers.scale.height = height * devicePixelRatio;


    this.chartView.ctx = canvasLayers.base.getContext("2d");
    this.chartView.crosshairCtx = canvasLayers.scale.getContext("2d");
    this.chartView.width = width;
    this.chartView.height = height;
    this.chartView.devicePixelRatio = devicePixelRatio;
    this.chartView.style = !theme ? chartThemes()['light'] : theme;
    this.chartView.stickLength = zoom * devicePixelRatio;
    this.chartView.config = !config ? chartDefaultConfig() : config;
    this.chartView.geometry = !config
      ? new Pane().initGeometry(chartDefaultConfig().geometry, this.chartView.width, this.chartView.height, devicePixelRatio)
      : new Pane().initGeometry(config.geometry, this.chartView.width, this.chartView.height, devicePixelRatio);
    this.chartView.chartType = !config ? chartDefaultConfig().chartType : config.chartType;
    this.chartView.locale = !config ? chartDefaultConfig().locale : config.locale;
    this.chartView.stickMargin = this.chartView.config.stickMargin * devicePixelRatio;
    this.chartView.offset = offset;
    this.chartView.fontSize = this.chartView.config.fontSize * devicePixelRatio;
  }

  addCandlestickSeries(data: any) {
    this.quotes = data;
    this.chartDraw();
  }

  
  subscribeCrosshairMove(cb:any) {
    const lisener = () => {
        const info = {
          data: this.viewModel.cursorData[0], 
          series: this.viewModel.cursorData[2]
        }
        
        if(info.data) {
          cb(info);
        }
    }
    document.removeEventListener('mousemove', lisener);
    document.addEventListener('mousemove',  lisener );
  }

  private handleMouseEvent() {
    // mouse move event
    this.chartView.crosshairCtx.canvas.onmousemove = (e: any) => {
      const { clientX, clientY } = e;
      this.chartSetCursor(clientX, clientY);
      this.chartDrawCrosshair();
    }

    // mouse wheel event
    this.chartView.crosshairCtx.canvas.onwheel = (e: any) => {
      e.preventDefault();
      const { deltaY, deltaX, wheelDeltaY, deltaMode } = e;
      let isTrackpad = false;
      let scale = this.chartView.stickLength;
      let offset = this.chartView.offset;
      if (wheelDeltaY) {
        if (wheelDeltaY === (deltaY * -3)) {
          isTrackpad = true;
        }
      }
      else if (deltaMode === 0) {
        isTrackpad = true;
      }

      // offset
      offset -= e.deltaX * -2;
      // Restrict offset
      offset = Math.min(Math.max(-this.quotes.length+130, offset), 0);
      this.chartSetOffset(offset);

      // zoom
      scale += deltaY * -0.01;
      // Restrict scale
      scale = Math.min(Math.max(1, scale), 15);
      this.chartSetZoom(scale);
    }
  }

  chartDraw() {
    if (!this.chartView.ctx) return;

    // clear drawing
    this.chartView.ctx.clearRect(0, 0, this.chartView.width * this.chartView.devicePixelRatio, this.chartView.height * this.chartView.devicePixelRatio);

    // init current view model
    const width = this.chartView.geometry.boxPrice.content[2];
    const capacity = Math.floor(width / this.chartView.stickLength);
    this.viewModel = new View().getView();
    this.viewModel.initView(capacity, Math.round(this.chartView.offset), this.quotes, this.chartView.locale);

    // draw all the elements        
    grid(this.chartView, this.viewModel.quotes, this.viewModel.priceLines, this.viewModel.timeLines);
    watermark(this.chartView, this.options.watermark);
    price(this.chartView, this.viewModel.quotes);

    if(this.lineSeriesData.length>0){
      new SeriesApi(this).drawLineSeries();
    }

    if (this.chartView.geometry.boxVolume) {
      volume(this.chartView, this.viewModel.quotes);
    }

    this.handleMouseEvent();
    this.chartDrawCrosshair();
  }

  chartDrawCrosshair() {
    if (!this.chartView.crosshairCtx) return;
    // clear drawing
    this.chartView.crosshairCtx.clearRect(0, 0, this.chartView.width * this.chartView.devicePixelRatio, this.chartView.height * this.chartView.devicePixelRatio);
    scale(this.chartView, this.viewModel.quotes, this.viewModel.priceLines, this.viewModel.timeLines, this.viewModel.cursorData);
    const cursorData = crosshair(this.chartView, this.viewModel.quotes, this.viewModel.cursorData, this.cursor, this.viewModel.seriesQuotes);
    this.viewModel.cursorData = cursorData;
  }

  private chartSetCursor(x: number, y: number) {
    this.cursor[0] = x * this.chartView.devicePixelRatio;
    this.cursor[1] = y * this.chartView.devicePixelRatio;
  }

  private chartSetZoom(zoom: number) {
    this.chartView.stickLength = zoom;
    this.chartDraw();
  }

  private chartSetOffset(offset: number) {
    this.chartView.offset = offset;
    this.chartDraw();
  }

  addLineSeries({color, lineWidth}:any){
    this.lineSeries.push({color, lineWidth});
    return this;
  }

  setData(data: any)  {
    this.lineSeriesData.push(data);
    new SeriesApi(this).drawLineSeries();
  }

}