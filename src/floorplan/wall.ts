import { Edge } from "../edge";

export class Wall {
  public edge: Edge;
  public thickness: number;
  public height: number;

  constructor(edge: Edge, thickness: number = 10, height: number = 250) {
    this.edge = edge;
    this.thickness = thickness;
    this.height = height;
  }

  get angle() {
    return Math.atan2(
      this.edge.end.y - this.edge.start.y,
      this.edge.end.x - this.edge.start.x
    ) * -1;
  }

  get width() {
    return Math.hypot(
      this.edge.end.x - this.edge.start.x,
      this.edge.end.y - this.edge.start.y
    );
  }

  get center() {
    return {
      x: (this.edge.start.x + this.edge.end.x) / 2,
      y: (this.edge.start.y + this.edge.end.y) / 2,
    };
  }
}
