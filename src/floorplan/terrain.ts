import { Edge } from "../edge";
import { Vertex } from "../vertex";

export class Terrain {
  constructor(
    public width: number,
    public height: number,
    public center: Vertex
  ) {}
}
