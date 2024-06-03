import { fabric } from "fabric";
import { Line } from "fabric/fabric-impl";
import { Icon } from "solid-heroicons";
import { homeModern } from "solid-heroicons/outline";
import { createSignal, onCleanup, onMount } from "solid-js";
import { useSceneContext } from "../../2d/Scene";
import { useFloorPlanContext } from "../../floorplan/FloorplanProvider";
import { newWall } from "../../floorplan/wall";
import { useGuidanceContext } from "../../guidance/GuidanceContext";
import { cmToPx } from "../../utils/dimensions";
import { Vertex } from "../../vertex";

export function AddWall() {
  const { scene } = useSceneContext()!;
  const { setMessage } = useGuidanceContext()!;
  const { addObjects } = useFloorPlanContext();

  const wallThickness = cmToPx(10);

  const [lastPoint, setLastPoint] = createSignal<Vertex | null>(null);
  const [currentLine, setCurrentLine] = createSignal<Line | null>(null);

  const object = new fabric.Group([], {
    selectable: false,
    evented: false,
  });

  onMount(() => {
    document.addEventListener("keypress", onPressKey);
  });

  onCleanup(() => {
    document.removeEventListener("keypress", onPressKey);
  });

  function onPressKey(event: KeyboardEvent) {
    if (event.key.toLowerCase() === "w") {
      addWall();
    }
  }

  function addWall() {
    setMessage(
      "Click to start drawing a wall. \n Press Enter to finish. \nPress Esc to cancel."
    );
    const s = scene();
    s.defaultCursor = "crosshair";
    s.selection = false;
    s.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });

    s.on("mouse:up", onMouseUp);
    s.on("mouse:move", onMouseMove);
    document.addEventListener("keypress", onKeyUp);

    object.bringToFront();

    s.add(object);
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === "Escape") {
      currentLine() && scene().remove(currentLine()!);
      setCurrentLine(null);
      setLastPoint(null);
      object.remove();
      scene().renderAll();

      scene().remove(object);

      scene().forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;
      });
    }

    if (e.key === "Enter") {
      scene().remove(currentLine()!);
      setCurrentLine(null);
      setLastPoint(null);
      setMessage(null);

      const lines = object.getObjects() as Line[];

      const walls = lines.map((line) => {
        return newWall({
          start: { x: line.x1!, y: line.y1! },
          end: { x: line.x2!, y: line.y2! },
        });
      });

      scene().renderAll();
      scene().remove(object);

      addObjects(walls);
      scene().forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;
      });
    }

    scene().defaultCursor = "default";
    scene().selection = true;
    setMessage(null);
    document.removeEventListener("keypress", onKeyUp);
    scene().off("mouse:up", onMouseUp as any);
    scene().off("mouse:move", onMouseMove);
  }

  function onMouseMove(opt: fabric.IEvent<Event>) {
    if (!lastPoint()) {
      return;
    }
    const pointer = scene().getPointer(opt.e);

    currentLine()?.set("x2", pointer.x);
    currentLine()?.set("y2", pointer.y);

    snap();

    scene()!.renderAll();
  }

  function snap() {
    const currentPoint: Vertex = {
      x: currentLine()!.x2!,
      y: currentLine()!.y2!,
    };

    const deltaX = currentPoint.x - lastPoint()!.x;
    if (Math.abs(deltaX) < 10) {
      currentLine()!.set("x2", lastPoint()!.x);
    }

    const deltaY = currentPoint.y - lastPoint()!.y;
    if (Math.abs(deltaY) < 10) {
      currentLine()!.set("y2", lastPoint()!.y);
    }

    const closeByPoint: Line = object.getObjects().find((obj) => {
      if (obj === currentLine()) {
        return false;
      }

      const line = obj as fabric.Line;

      const deltaX = line.x1! - currentLine()!.x2!;
      const deltaY = line.y1! - currentLine()!.y2!;

      return Math.sqrt(deltaX * deltaX + deltaY * deltaY) < 10;
    }) as Line;

    if (!closeByPoint) return;

    currentLine()!.set("x2", closeByPoint.x1);
    currentLine()!.set("y2", closeByPoint.y1);
  }

  function onMouseUp(e: fabric.IEvent<MouseEvent>) {
    const pointer = scene()!.getPointer(e.e);

    setLastPoint(pointer);

    if (currentLine()) {
      object.addWithUpdate(currentLine()!);
      scene().remove(currentLine()!);
    }

    setCurrentLine(
      new fabric.Line(
        [
          currentLine()?.x2 || pointer.x,
          currentLine()?.y2 || pointer.y,
          pointer.x,
          pointer.y,
        ],
        {
          stroke: "black",
          strokeWidth: wallThickness,
          selectable: false,
          evented: false,
        }
      )
    );
    currentLine()?.bringToFront();
    scene()!.add(currentLine()!);
    scene().renderAll();
  }

  return (
    <>
      <div
        id="tooltip-wall"
        role="tooltip"
        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Draw Wall
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
      <button
        data-tooltip-target="tooltip-wall"
        data-tooltip-placement="right"
        onClick={addWall}
        type="button"
        class={
          "hover:bg-primary-200 bg-primary-50 text-primary-800 rounded-md p-2  transition-colors duration-200 active:outline active:outline-1"
        }
      >
        <Icon path={homeModern} width={24} />
      </button>
    </>
  );
}
