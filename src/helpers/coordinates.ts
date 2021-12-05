/**
 * Translate price to screen coordinate
 */
export function toScreen(value:any, height:any, min:any, max:any) {
  const ratio = height / (max - min);
  return Math.round(height - (value - min) * ratio);
}

/**
 * Translate screen coordinate to price
 */
export function fromScreen(value:any, height:any, min:any, max:any) {
  const ratio = height / (max - min);
  return height / ratio + min - value / ratio;
}
