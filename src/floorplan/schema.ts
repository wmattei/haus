import { Terrain } from "./terrain";
import { Wall } from "./wall";

export class Schema {
  constructor(public walls: Array<Wall>, public terrains: Array<Terrain>) {}

  static fromJson(json: string) {
    const data: Schema = JSON.parse(json);

    Object.setPrototypeOf(data, Schema.prototype);
    data.terrains.forEach((t) => Object.setPrototypeOf(t, Terrain.prototype));
    data.walls.forEach((w) => Object.setPrototypeOf(w, Wall.prototype));
    return data;
  }

  findTerrainIndex(id: string) {
    return this.terrains.findIndex((t) => t.id === id);
  }
}
