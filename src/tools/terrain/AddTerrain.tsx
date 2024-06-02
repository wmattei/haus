import { fabric } from "fabric";
import { Icon } from "solid-heroicons";
import { square_2Stack } from "solid-heroicons/outline";
import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import { useSceneContext } from "../../2d/Scene";
import { cmToPx } from "../../utils/dimensions";
import { useFloorPlanContext } from "../../floorplan/FloorplanProvider";
import { Terrain } from "../../floorplan/terrain";
import { Vertex } from "../../vertex";
import { useGuidanceContext } from "../../guidance/GuidanceContext";

const width = 1200;
const height = 2500;

export function AddTerrain() {
  const [object, setObject] = createSignal<fabric.Polygon | null>(null);

  const { scene } = useSceneContext()!;
  const { addTerrain } = useFloorPlanContext();
  const { setMessage } = useGuidanceContext()!;

  onMount(() => {
    document.addEventListener("keypress", onPressKey);
  });

  onCleanup(() => {
    document.removeEventListener("keypress", onPressKey);
  });

  function onPressKey(event: KeyboardEvent) {
    if (event.key.toLowerCase() === "t") {
      createRectangularTerrain({ clientX: 0, clientY: 0 } as MouseEvent);
    }
  }

  function createRectangularTerrain(e: MouseEvent) {
    const center = scene()!.getPointer(e);
    const rectangle = new fabric.Rect({
      width: cmToPx(width),
      height: cmToPx(height),
      left: center.x - width / 2,
      top: center.y - height / 2,
    });

    drawTerrain(rectangle.getCoords() as Vertex[]);
  }

  function drawTerrain(vertices: Vertex[]) {
    setMessage("Click to confirm. Press Escape to cancel");
    const points = vertices.map((vertex) => {
      return new fabric.Point(vertex.x, vertex.y);
    });

    setObject(
      new fabric.Polygon(points, {
        fill: "lightgreen",
        stroke: "green",
        strokeWidth: 1,
        hasControls: false,
        selectable: false,
      })
    );

    document.addEventListener("keypress", (e) => {
      if (e.key === "Escape") {
        scene().remove(object()!);
        scene().off("mouse:move", onMouseMove);
        scene().off("mouse:up", onMouseUp);

        setMessage("");
      }
    });

    scene().add(object()!);

    scene().on("mouse:move", onMouseMove);
    scene().on("mouse:up", onMouseUp);

    scene()!.renderAll();
  }

  function onMouseMove(opt: fabric.IEvent<Event>) {
    const pointer = scene()!.getPointer(opt.e);
    object()!.set({
      left: pointer.x - object()!.width! / 2,
      top: pointer.y - object()!.height! / 2,
    });

    scene()!.renderAll();
  }

  function onMouseUp() {
    scene()!.off("mouse:move", onMouseMove);

    const center = object()!.getCenterPoint();

    const terrainId = fabric.util.getRandomInt(0, 1000000).toString();
    addTerrain({
      id: terrainId,
      width,
      height,
      center: { x: center.x, y: center.y },
    });

    scene().remove(object()!);

    scene()!.off("mouse:up", onMouseUp);
    setMessage("");
  }

  return (
    <>
      <div
        id="tooltip-terrain"
        role="tooltip"
        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Add Terrain
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
      <button
        data-tooltip-target="tooltip-terrain"
        data-tooltip-placement="right"
        onClick={createRectangularTerrain}
        type="button"
        class={
          "hover:bg-primary-200 bg-primary-50 text-primary-800 rounded-md p-2  transition-colors duration-200 active:outline active:outline-1"
        }
      >
        <Icon path={square_2Stack} width={24} />
      </button>
    </>
  );
}
