import { Edge } from "../edge";
import { Vertex } from "../vertex";
import { ObjectType } from "./objectType";
import { Object } from "./schema";

export interface Terrain extends Object {
  objectType: ObjectType.Terrain;
  width: number;
  height: number;
  center: Vertex;
}

export function newTerrain(
  center: Vertex,
  width: number,
  height: number
): Terrain {
  return {
    id: Math.random().toString(),
    objectType: ObjectType.Terrain,
    center,
    width,
    height,
    children: [],
  };
}

export function getTerrainEdges(terrain: Terrain): Array<Edge> {
  return [
    {
      start: {
        x: terrain.center.x - terrain.width / 2,
        y: terrain.center.y - terrain.height / 2,
      },
      end: {
        x: terrain.center.x + terrain.width / 2,
        y: terrain.center.y - terrain.height / 2,
      },
    },
    {
      start: {
        x: terrain.center.x + terrain.width / 2,
        y: terrain.center.y - terrain.height / 2,
      },
      end: {
        x: terrain.center.x + terrain.width / 2,
        y: terrain.center.y + terrain.height / 2,
      },
    },
    {
      start: {
        x: terrain.center.x + terrain.width / 2,
        y: terrain.center.y + terrain.height / 2,
      },
      end: {
        x: terrain.center.x - terrain.width / 2,
        y: terrain.center.y + terrain.height / 2,
      },
    },
    {
      start: {
        x: terrain.center.x - terrain.width / 2,
        y: terrain.center.y + terrain.height / 2,
      },
      end: {
        x: terrain.center.x - terrain.width / 2,
        y: terrain.center.y - terrain.height / 2,
      },
    },
  ];
}
