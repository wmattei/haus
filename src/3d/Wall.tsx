import { Wall } from "../floorplan/wall";
import * as THREE from "three";
import { useScene3DContext } from "./Scene";
import { cmToPx, pxToCm } from "../utils/dimensions";

type Props = {
  wall: Wall;
};

export function WallObject({ wall }: Props) {
  const { scene } = useScene3DContext()!;

  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const geometry = new THREE.BoxGeometry(
    Math.abs(pxToCm(wall.width)) / 100,
    wall.height / 100, 
    wall.thickness / 100
  );
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.position.setX(pxToCm((wall.center.x) / 100));
  cube.position.setY(wall.height / 100 / 2);
  cube.position.setZ(pxToCm((wall.center.y) / 100));
  cube.rotateY(wall.angle);
  

  // const box = new THREE.BoxHelper(cube, 0xffff00);
  // scene.add(box);

  scene.add(cube);
  return null;
}
