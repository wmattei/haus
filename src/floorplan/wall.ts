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

  getAngle() {
    return Math.atan2(
      this.edge.end.y - this.edge.start.y,
      this.edge.end.x - this.edge.start.x
    );
  }
}
