/** 
* Pane Model
*/

export interface Pane  {
    boxPrice: any[] | null;
    boxVolume: any[] | null;
}

export class Pane {
    constructor(){
        this.boxPrice = null;
        this.boxVolume = null;
    }

    makeBox(viewportWidth:number, viewportHeight:number, boxConfig:any, devicePixelRatio:number) {
        const marginT = boxConfig.margin[0] * devicePixelRatio;
        const marginR = boxConfig.margin[1] * devicePixelRatio;
        const marginB = boxConfig.margin[2] * devicePixelRatio;
        const marginL = boxConfig.margin[3] * devicePixelRatio;
      
        const boxTop = marginT + viewportHeight * boxConfig.top * devicePixelRatio;
        const boxLeft = marginL;
        const boxWidth = viewportWidth * devicePixelRatio - marginL - marginR;
        const boxHeight = viewportHeight * boxConfig.height * devicePixelRatio - marginT - marginB;
      
        const padding = boxConfig.padding * devicePixelRatio;
      
        const box:any = {};
      
        box.padding = [
          Math.round(boxLeft) + 0.5,
          Math.round(boxTop) + 0.5,
          Math.round(boxWidth),
          Math.round(boxHeight),
        ];
      
        box.content = [
          Math.round(boxLeft + padding) + 0.5,
          Math.round(boxTop + padding) + 0.5,
          Math.round(boxWidth - padding * 2),
          Math.round(boxHeight - padding * 2)
        ];
      
        return box;
      }

      initGeometry(geometryConfig:any, width:number, height:number, devicePixelRatio:number) {
        this.boxPrice = this.makeBox(width, height, geometryConfig.boxPrice, devicePixelRatio);
      
        if (geometryConfig.boxVolume) {
          this.boxVolume = this.makeBox(width, height, geometryConfig.boxVolume, devicePixelRatio);
        } else {
          this.boxVolume = null;
        }
        
        return {boxPrice: this.boxPrice, boxVolume: this.boxVolume}
    }
}