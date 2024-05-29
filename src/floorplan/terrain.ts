import { Edge } from "../edge";
import { cmToPx } from "../utils/dimensions";
import { Vertex } from "../vertex";

export class Terrain {
  constructor(
    public id: string,
    public width: number,
    public height: number,
    public center: Vertex
  ) {}

  get widthPx() {
    return cmToPx(this.width);
  }
  get heightPx() {
    return cmToPx(this.height);
  }

  getVertices(): Array<Vertex> {
    return [
      { x: this.center.x - this.widthPx / 2, y: this.center.y - this.heightPx / 2 },
      { x: this.center.x + this.widthPx / 2, y: this.center.y - this.heightPx / 2 },
      { x: this.center.x + this.widthPx / 2, y: this.center.y + this.heightPx / 2 },
      { x: this.center.x - this.widthPx / 2, y: this.center.y + this.heightPx / 2 },
    ];
  }

  getEdges(): Array<Edge> {
    const vertices = this.getVertices();
    return [
      new Edge(vertices[0], vertices[1]),
      new Edge(vertices[1], vertices[2]),
      new Edge(vertices[2], vertices[3]),
      new Edge(vertices[3], vertices[0]),
    ];
  }
}
