import { Edge } from "../edge";
import { ObjectType } from "./objectType";
import { Object } from "./schema";

export interface Wall extends Object {
  objectType: ObjectType.Wall;
  edge: Edge;
  thickness: number;
  height: number;
}

export function newWall(edge: Edge, height = 230, thickness = 10): Wall {
  return {
    id: Math.random().toString(),
    objectType: ObjectType.Wall,
    edge,
    thickness,
    height,
    children: [],
  };
}

export function getWallAngle(wall: Wall) {
  return (
    Math.atan2(
      wall.edge.end.y - wall.edge.start.y,
      wall.edge.end.x - wall.edge.start.x
    ) * -1
  );
}

export function getWallWidth(wall: Wall) {
  return Math.hypot(
    wall.edge.end.x - wall.edge.start.x,
    wall.edge.end.y - wall.edge.start.y
  );
}

export function getWallCenter(wall: Wall) {
  return {
    x: (wall.edge.start.x + wall.edge.end.x) / 2,
    y: (wall.edge.start.y + wall.edge.end.y) / 2,
  };
}
