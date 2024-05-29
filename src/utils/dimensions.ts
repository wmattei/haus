import { Edge } from "../edge";
import { Vertex } from "../vertex";

const SCALE = 50;

export function cmToPx(meters: number) {
  return (meters * SCALE) / 100;
}

export function pxToCm(px: number) {
  return (px / SCALE) * 100;
}

export function pointsToEdges(points: Array<Vertex>): Array<Edge> {
  const edges = [];
  for (let i = 0; i < points.length; i++) {
    edges.push(new Edge(points[i], points[(i + 1) % points.length]));
  }
  return edges;
}
