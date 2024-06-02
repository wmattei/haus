import { Terrain } from "./terrain";
import { Wall } from "./wall";

export type Schema = {
  terrains: Terrain[];
  walls: Wall[];
};
