import { initViewModel, getViewModel } from "./helpers/viewModel";
import defaultConfig from "./config/defaultConfig";
import themes from "./config/themes";
import { initGeometry } from "./helpers/geometry";
import price from "./elements/price";
import grid from "./elements/grid";
import volume from "./elements/volume";
import scale from "./elements/scale";


interface IchartInit {
  data: any[];
  canvasLayers: any;
  width: number;
  height: number;
  zoom: number;
  offset: number;
  config: any;
  theme: any;
}

let quotes: any = [];
const chartView: any = {};
const cursor: any = [];


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

export function chartInit(data: any, canvasLayers: any, { width, height, zoom, offset, config, theme }: IchartInit) {

  const maxDimension = 8192;
  if (width > maxDimension || height > maxDimension) {
    throw new Error(`Maximum chart dimensions exceeded: [${width}x${height}]`);
  }
  cursor[0] = 0;
  cursor[1] = 0;
  quotes = data;

  const min = 2;
  const max = 13;
  if (zoom < min) zoom = min;
  if (zoom > max) zoom = max;

  const devicePixelRatio = window.devicePixelRatio;
  canvasLayers.base.width = width * devicePixelRatio;
  canvasLayers.base.height = height * devicePixelRatio;
  canvasLayers.scale.width = width * devicePixelRatio;
  canvasLayers.scale.height = height * devicePixelRatio;

  chartView.ctx = canvasLayers.base.getContext("2d");
  chartView.crosshairCtx = canvasLayers.scale.getContext("2d");
  chartView.width = width;
  chartView.height = height;
  chartView.devicePixelRatio = devicePixelRatio;
  chartView.style = theme;
  chartView.config = config;
  chartView.geometry = initGeometry(config.geometry, chartView.width, chartView.height, devicePixelRatio);
  chartView.chartType = config.chartType;
  chartView.stickLength = zoom * devicePixelRatio;
  chartView.stickMargin = chartView.config.stickMargin * devicePixelRatio;
  chartView.offset = offset;
  chartView.fontSize = chartView.config.fontSize * devicePixelRatio;
  chartView.locale = config.locale;

}

export function chartDraw() {
  if (!chartView.ctx) return;

  // clear drawing
  chartView.ctx.clearRect(0, 0, chartView.width * chartView.devicePixelRatio, chartView.height * chartView.devicePixelRatio);

  // init current view model
  const width = chartView.geometry.boxPrice.content[2];
  const capacity = Math.floor(width / chartView.stickLength);

  initViewModel(capacity, Math.round(chartView.offset), quotes, chartView.locale);

  // draw all the elements
  const viewModel = getViewModel();
  grid(chartView, viewModel.quotes, viewModel.priceLines, viewModel.timeLines);
  price(chartView, viewModel.quotes);

  if (chartView.geometry.boxVolume) {
    volume(chartView, viewModel.quotes);
  }

  scale(chartView, viewModel.quotes, viewModel.priceLines, viewModel.timeLines, viewModel.cursorData);

}