import { Vertex } from "./vertex";

export class Edge {
  public start: Vertex;
  public end: Vertex;
  constructor(start: Vertex, end: Vertex) {
    this.start = start;
    this.end = end;
  }
}
