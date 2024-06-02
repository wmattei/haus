import { Edge, getEdgeCenter } from "../edge";
import { Vertex } from "../vertex";

export type Terrain = {
  id: string;
  width: number;
  height: number;
  center: Vertex;
};

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
