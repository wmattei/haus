import { Vertex } from "./vertex";

export class Edge {
  public start: Vertex;
  public end: Vertex;
  constructor(start: Vertex, end: Vertex) {
    this.start = start;
    this.end = end;
  }

  get size() {
    return (
      Math.sqrt(
        Math.pow(this.start.x - this.end.x, 2) +
          Math.pow(this.start.y - this.end.y, 2)
      ) - 1
    );
  }

  get center() {
    return new Vertex(
      (this.start.x + this.end.x) / 2,
      (this.start.y + this.end.y) / 2
    );
  }
}
