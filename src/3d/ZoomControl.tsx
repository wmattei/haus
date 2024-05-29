import { onMount } from "solid-js";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import { useScene3DContext } from "./Scene";

const INITIAL_DISTANCE = 10; // 5m

export function ZoomControl3d() {
  const { camera, renderer, onUpdate, scene } = useScene3DContext()!;

  onMount(() => {
    const controls = new MapControls(camera, renderer()!.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;

    camera.position.set(0, INITIAL_DISTANCE, 20);
    camera.rotation.set(0, 0, 0);

    onUpdate(() => {
      controls.update();
    });
  });

  return null;
}
