import { createSignal, onMount } from "solid-js";
import { useSceneContext } from "./Scene";
import { Vertex } from "../vertex";

export function SelectionControl() {
  const { scene } = useSceneContext()!;
  const [mouseDownTime, setMouseDownTime] = createSignal<number>(0);
  const [lastPos, setLastPos] = createSignal<Vertex>({ x: 0, y: 0 });

  onMount(() => {
    const c = scene();
    c.on("object:modified", (e) => {
      c.discardActiveObject();
    });
    c.on("mouse:down", () => {
      setMouseDownTime(Date.now());
    });
    c.on("mouse:up", (e) => {
      if (mouseDownTime() === 0) return;
      if (Date.now() - mouseDownTime() < 200) {
        c.fire("mouse:click", e);
      }
    });

    c.on("mouse:move", (opt) => {
      const deltaX = opt.e.clientX - lastPos().x;
      const deltaY = opt.e.clientY - lastPos().y;
      if (Math.abs(deltaX) + Math.abs(deltaY) >= 1) {
        setMouseDownTime(0);
      }
      setLastPos({ x: opt.e.clientX, y: opt.e.clientY });
    });

    c.on("mouse:click", (e) => {
      if (!e.target) return;
      scene()?.setActiveObject(e.target);
    });
  });
  return null;
}
