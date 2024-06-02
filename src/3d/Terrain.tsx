import { cmToPx, pxToCm } from "../utils/dimensions";
import { Terrain } from "../floorplan/terrain";
import { useScene3DContext } from "./Scene";
import * as THREE from "three";
import { createEffect, mergeProps, onCleanup, onMount } from "solid-js";
import { reconcile } from "solid-js/store";

type Props = {
  terrain: Terrain;
};

export function TerrainObject(props: Props) {
  const { scene } = useScene3DContext()!;

  onCleanup(() => {
    const object = scene.getObjectByName(props.terrain.id);
    scene.remove(object!);
  });

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("src/assets/textures/grass.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);

  const material = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  const terrain = new THREE.Mesh(undefined, material);
  terrain.rotation.x = -Math.PI / 2;
  terrain.receiveShadow = true;

  terrain.name = props.terrain.id;

  scene.add(terrain);

  createEffect(() => {
    terrain.position.setX(pxToCm(props.terrain.center.x) / 100);
    terrain.position.setZ(pxToCm(props.terrain.center.y) / 100);
  });

  createEffect(() => {
    terrain.geometry?.dispose();
    const newGeometry = new THREE.PlaneGeometry(
      props.terrain.width / 100,
      props.terrain.height / 100
    );
    terrain.geometry = newGeometry;
  });

  return null;
}
