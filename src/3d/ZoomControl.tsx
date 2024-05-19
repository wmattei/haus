import { createEffect, createSignal, onMount } from "solid-js";
import { ZoomInput } from "../components/ZoomInput";
import { useScene3DContext } from "./Scene";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import * as THREE from "three";
import { useFloorPlanContext } from "../floorplan/FloorplanProvider";

const INITIAL_DISTANCE = 50;
const MAX_DISTANCE = INITIAL_DISTANCE * 10;
const MIN_DISTANCE = INITIAL_DISTANCE / 30;

export function ZoomControl3d() {
  const { camera, renderer, onUpdate } = useScene3DContext()!;
  const [zoom, setZoom] = createSignal(1);
  const { viewMode } = useFloorPlanContext();
  const [controls, setControls] = createSignal<MapControls>();

  onMount(() => {
    camera.position.set(0, INITIAL_DISTANCE, 0);
    const controls = new MapControls(camera, renderer()?.domElement);
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.maxDistance = MAX_DISTANCE;
    controls.minDistance = MIN_DISTANCE;

    setControls(controls);

    controls.addEventListener("change", () => {
      setZoom(INITIAL_DISTANCE / controls.getDistance());
    });

    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };

    onUpdate((dt) => {
      controls.update(dt);
    });
  });

  function increment() {
    camera.position.y -= (INITIAL_DISTANCE * 10) / 100;
  }

  function decrement() {
    camera.position.y += (INITIAL_DISTANCE * 10) / 100;
  }

  return (
    <ZoomInput
      visible={viewMode() === "3d"}
      zoom={zoom}
      onIncrement={increment}
      onDecrement={decrement}
    />
  );
}
