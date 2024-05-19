import { Wall } from "../floorplan/wall";
import * as THREE from "three";
import { useScene3DContext } from "./Scene";

type Props = {
  wall: Wall;
};

export function WallObject({ wall }: Props) {
  const { scene } = useScene3DContext()!;

  const width = wall.edge.end.x - wall.edge.start.x;

  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const geometry = new THREE.BoxGeometry(
    width / 100,
    wall.height / 100,
    wall.thickness / 100
  );
  const cube = new THREE.Mesh(geometry, material);

  cube.castShadow = true;
  cube.position.set(
    wall.edge.start.x / 100 + width / 2 / 100,
    wall.height / 100 / 2,
    wall.edge.start.y / 100 - width / 2 / 100
  );

  cube.rotateY(wall.getAngle());

  scene.add(cube);
  return null;
}
