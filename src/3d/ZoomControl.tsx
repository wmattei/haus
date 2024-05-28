import { createSignal, onMount } from "solid-js";
import * as THREE from "three";
import { ZoomInput } from "../components/ZoomInput";
import { useFloorPlanContext } from "../floorplan/FloorplanProvider";
import { useScene3DContext } from "./Scene";

const INITIAL_DISTANCE = 5; // 5m
const MAX_DISTANCE = 30; // 10m
const MIN_DISTANCE = 0.5;
const _euler = new THREE.Euler(0, 0, 0, "YXZ");
const _vector = new THREE.Vector3();

export function ZoomControl3d() {
  const { camera, renderer, onUpdate, scene } = useScene3DContext()!;
  const [zoom, setZoom] = createSignal(INITIAL_DISTANCE);
  const { viewMode } = useFloorPlanContext();
  const [dragging, setDragging] = createSignal();
  const [mouse, setMouse] = createSignal<THREE.Vector3>();

  onMount(() => {
    camera.position.set(0, INITIAL_DISTANCE, 0);
    camera.rotation.set(0, 0, 0);

    const pressedKeys: Record<string, boolean> = {};

    document.addEventListener("keydown", (e) => {
      let key = e.key.toLowerCase();
      if (key === " ") key = "space";
      pressedKeys[key] = true;
    });
    document.addEventListener("keyup", (e) => {
      let key = e.key.toLowerCase();
      if (key === " ") key = "space";
      pressedKeys[key] = false;
    });

    document.addEventListener("mousedown", (e) => {
      setDragging(true);
      renderer()!.domElement.style.cursor = "grabbing";
    });
    document.addEventListener("mouseup", () => {
      renderer()!.domElement.style.cursor = "grab";
      setDragging(false);
    });
    document.addEventListener("mousemove", (event) => {
      if (!dragging()) return false;
      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      _euler.setFromQuaternion(camera.quaternion);

      _euler.y += movementX * 0.002 * 1;
      _euler.x += movementY * 0.002 * 1;

      _euler.x = Math.max(
        Math.PI / 2 - Math.PI,
        Math.min(Math.PI / 2 - 0, _euler.x)
      );

      camera.quaternion.setFromEuler(_euler);
    });

    onUpdate(() => {
      // console.info(pressedKeys);
      if (pressedKeys["shift"]) {
        const newZoom = camera.position.y - 0.05;
        if (+newZoom.toFixed(2) >= MIN_DISTANCE) {
          camera.position.y = newZoom;
          setZoom(newZoom);
        }
      }
      if (pressedKeys["space"]) {
        const newZoom = camera.position.y + 0.05;
        if (+newZoom.toFixed(2) <= MAX_DISTANCE) {
          camera.position.y = newZoom;
          setZoom(newZoom);
        }
      }
      if (pressedKeys["w"]) {
        _vector.setFromMatrixColumn(camera.matrix, 0);
        _vector.crossVectors(camera.up, _vector);
        camera.position.addScaledVector(_vector, 0.1);
      }
      if (pressedKeys["a"]) {
        _vector.setFromMatrixColumn(camera.matrix, 0);
        camera.position.addScaledVector(_vector, -0.05);
      }
      if (pressedKeys["s"]) {
        _vector.setFromMatrixColumn(camera.matrix, 0);
        _vector.crossVectors(camera.up, _vector);
        camera.position.addScaledVector(_vector, -0.1);
      }
      if (pressedKeys["d"]) {
        _vector.setFromMatrixColumn(camera.matrix, 0);
        camera.position.addScaledVector(_vector, 0.05);
      }
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
