/**
 * Chart box model geometry
 */
const geometry = {
  boxPrice: null,
  boxVolume: null,
}

export function makeBox(viewportWidth:number, viewportHeight:number, boxConfig:any, devicePixelRatio:number) {
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

export function initGeometry(geometryConfig:any, width:number, height:number, devicePixelRatio:number) {
  geometry.boxPrice = makeBox(width, height, geometryConfig.boxPrice, devicePixelRatio);

  if (geometryConfig.boxVolume) {
    geometry.boxVolume = makeBox(width, height, geometryConfig.boxVolume, devicePixelRatio);
  } else {
    geometry.boxVolume = null;
  }
  return geometry;
}
