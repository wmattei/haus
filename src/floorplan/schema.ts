import { Terrain } from "./terrain";
import { Wall } from "./wall";

export type Schema = {
  walls: Array<Wall>;
  terrains: Array<Terrain>;
};
