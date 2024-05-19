import { Terrain } from "../floorplan/terrain";
import { useScene3DContext } from "./Scene";
import * as THREE from "three";

type Props = {
  terrain: Terrain;
};

export function TerrainObject({ terrain }: Props) {
  const { scene } = useScene3DContext()!;
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("src/assets/textures/grass.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);

  const geometry = new THREE.PlaneGeometry(terrain.width / 100, terrain.height / 100);
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;

  scene.add(plane);

  return null;
}
