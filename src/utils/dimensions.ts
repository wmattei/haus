const SCALE = 50;

export function cmToPx(meters: number) {
  return (meters * SCALE) / 100;
}

export function pxToCm(px: number) {
  return px / SCALE * 100;
}
