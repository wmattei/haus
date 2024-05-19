import { fabric } from "fabric";
import { Icon } from "solid-heroicons";
import { square_2Stack } from "solid-heroicons/outline";
import { createSignal } from "solid-js";
import { useSceneContext } from "../../2d/Scene";
import { metersToPixels } from "../../2d/utils/dimensions";
import { Vertex } from "../../vertex";
import { useFloorPlanContext } from "../../floorplan/FloorplanProvider";
import { Terrain } from "../../floorplan/terrain";
import { Edge } from "../../edge";

export function AddTerrain() {
  const [object, setObject] = createSignal<fabric.Polygon | null>(null);

  const { scene } = useSceneContext()!;
  const { addTerrain } = useFloorPlanContext();

  function createRectangularTerrain(e: MouseEvent) {
    const width = metersToPixels(12);
    const height = metersToPixels(25);

    const center = scene()!.getPointer(e);

    const rectangle = new fabric.Rect({
      width,
      height,
      left: center.x - width / 2,
      top: center.y - height / 2,
    });

    drawTerrain(rectangle.getCoords() as Vertex[]);
  }

  function drawTerrain(vertices: Vertex[]) {
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
    object()!.selectable = true;
    object()!.hasControls = true;

    const image = new Image();
    image.src = "src/assets/textures/grass.png";
    image.onload = () => {
      const pattern = new fabric.Pattern({
        source: image,
        repeat: "repeat",
      });
      object()!.set("fill", pattern);
      scene()!.renderAll();
    };

    const center = object()!.getCenterPoint();
    const width = object()!.width!;
    const height = object()!.height!;

    addTerrain(new Terrain(width, height, new Vertex(center.x, center.y)));

    scene()!.off("mouse:up", onMouseUp);
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
