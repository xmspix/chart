import LineSeries from '../gui/series';

export interface SeriesApi {
    lineSeries: any[];
    lineSeriesData: any[];
    chart: any;
}

export class SeriesApi {
    constructor(chart: any){
        this.chart = chart;
        return this
    }

      drawLineSeries() {
        LineSeries(this.chart.chartView, this.chart.lineSeriesData, this.chart.viewModel.quotes, this.chart.lineSeries,this.chart.viewModel);
        return this;
      }

      getSeries() {
        return this;
      }

}