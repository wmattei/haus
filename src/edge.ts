import { Vertex } from "./vertex";

export type Edge = {
  start: Vertex;
  end: Vertex;

  // get size() {
  //   return (
  //     Math.sqrt(
  //       Math.pow(this.start.x - this.end.x, 2) +
  //         Math.pow(this.start.y - this.end.y, 2)
  //     ) - 1
  //   );
  // }

  // get center() {
  //   return new Vertex(
  //     (this.start.x + this.end.x) / 2,
  //     (this.start.y + this.end.y) / 2
  //   );
  // }
};

export function getEdgeSize(edge: Edge) {
  return (
    Math.sqrt(
      Math.pow(edge.start.x - edge.end.x, 2) +
        Math.pow(edge.start.y - edge.end.y, 2)
    ) - 1
  );
}

export function getEdgeCenter(edge: Edge) {
  return {
    x: (edge.start.x + edge.end.x) / 2,
    y: (edge.start.y + edge.end.y) / 2,
  };
}
