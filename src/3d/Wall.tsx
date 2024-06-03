import * as THREE from "three";
import {
  Wall,
  getWallAngle,
  getWallCenter,
  getWallWidth,
} from "../floorplan/wall";
import { pxToCm } from "../utils/dimensions";
import { useScene3DContext } from "./Scene";

type Props = {
  wall: Wall;
};

export function WallObject(props: Props) {
  const { scene } = useScene3DContext()!;

  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const geometry = new THREE.BoxGeometry(
    Math.abs(pxToCm(getWallWidth(props.wall))) / 100,
    props.wall.height / 100,
    props.wall.thickness / 100
  );
  const cube = new THREE.Mesh(geometry, material);
  const wallCenter = getWallCenter(props.wall);
  cube.castShadow = true;
  cube.position.setX(pxToCm(wallCenter.x / 100));
  cube.position.setY(props.wall.height / 100 / 2);
  cube.position.setZ(pxToCm(wallCenter.y / 100));
  cube.rotateY(getWallAngle(props.wall));

  // const box = new THREE.BoxHelper(cube, 0xffff00);
  // scene.add(box);

  scene.add(cube);
  return null;
}
