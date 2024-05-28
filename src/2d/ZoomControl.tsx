import { createSignal, onMount } from "solid-js";
import { ZoomInput } from "../components/ZoomInput";
import { useSceneContext } from "./Scene";

const MAX_SCALE = 15;
const MIN_SCALE = 0.05;
const INITIAL_SCALE = 0.5;

export function ZoomControl2d() {
  const { scene } = useSceneContext()!;
  const [zoom, setZoom] = createSignal(1);

  onMount(() => {
    const currentScene = scene();
    currentScene.setZoom(INITIAL_SCALE);

    currentScene.on("mouse:wheel", onWheel);
  });

  function handleZoom(opt: fabric.IEvent<WheelEvent>) {
    let z = scene()!.getZoom();
    z *= 0.999 ** opt.e.deltaY;
    if (z > MAX_SCALE) z = MAX_SCALE;
    if (z < MIN_SCALE) z = MIN_SCALE;

    scene()!.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, z);
    opt.e.preventDefault();
    opt.e.stopPropagation();

    setZoom(z / INITIAL_SCALE);
  }

  function onWheel(opt: fabric.IEvent<WheelEvent>) {
    if (opt.e.metaKey) {
      scene()!.relativePan({ x: -opt.e.deltaX * 2, y: 0 });
      return;
    }

    if (opt.e.shiftKey) {
      scene()!.relativePan({ x: -opt.e.deltaX * 2, y: -opt.e.deltaY * 2 });
      return;
    }

    handleZoom(opt);
  }

  function increment() {
    let z = scene()!.getZoom();
    z += 0.1;
    if (z > MAX_SCALE) z = MAX_SCALE;

    const center = scene().getCenter();
    scene()!.zoomToPoint({ x: center.left, y: center.top }, z);
    setZoom(z);
  }

  function decrement() {
    let z = scene()!.getZoom();
    z -= 0.1;
    if (z < MIN_SCALE) z = MIN_SCALE;

    const center = scene().getCenter();
    scene()!.zoomToPoint({ x: center.left, y: center.top }, z);
    setZoom(z);
  }

  return (
    <ZoomInput
      visible={false} // TODO
      zoom={zoom}
      onIncrement={zoom() <= MAX_SCALE ? increment : undefined}
      onDecrement={zoom() >= MAX_SCALE ? decrement : undefined}
    />
  );
}
