import { fabric } from "fabric";
import { Index, Show, createSignal, onCleanup } from "solid-js";
import { Edge } from "../edge";
import { useFloorPlanContext } from "../floorplan/FloorplanProvider";
import { ObjectType } from "../floorplan/objectType";
import { Terrain } from "../floorplan/terrain";
import { pointsToEdges, pxToCm } from "../utils/dimensions";
import { useSceneContext } from "./Scene";

type TerrainEdgeDimensionProps = {
  edge: Edge;
  topPadding?: number;
  leftPadding?: number;
};

function TerrainEdgeDimension(props: TerrainEdgeDimensionProps) {
  const { scene } = useSceneContext()!;

  const content = `${Math.ceil(props.edge.size)} cm`;

  const width = content.length * 10 + 20;
  const height = 42;

  props.leftPadding = props.leftPadding || 0;
  props.topPadding = props.topPadding || 0;

  let leftPadding = props.leftPadding;
  let topPadding = props.topPadding;

  if (props.leftPadding !== 0) {
    topPadding = topPadding - height / 2;

    if (Math.sign(props.leftPadding) === -1) {
      leftPadding = leftPadding - width;
    }
  }

  if (props.topPadding !== 0) {
    leftPadding = leftPadding - width / 2;

    if (Math.sign(props.topPadding) === -1) {
      topPadding = topPadding - height;
    }
  }

  const rectangle = new fabric.Rect({
    left: props.edge.center.x + leftPadding,
    top: props.edge.center.y + topPadding,
    width: width,
    height: height,
    stroke: "black",
    fill: "white",
    selectable: false,
    evented: false,
  });

  const text = new fabric.Text(content, {
    left: rectangle.left! + 10,
    top: rectangle.top! + 10,
    selectable: false,
    evented: false,
    fill: "black",
    fontSize: 20,
  });

  const group = new fabric.Group([rectangle, text], {
    selectable: false,
    evented: false,
  });

  scene()!.add(group);
  scene()!.renderAll();

  onCleanup(() => {
    scene()!.remove(group);
    scene()!.renderAll();
  });

  return null;
}

type Terrain2dObjectProps = {
  terrain: Terrain;
};

export function Terrain2dObject(props: Terrain2dObjectProps) {
  const { scene } = useSceneContext()!;
  const { deleteTerrain, updateTerrain } = useFloorPlanContext();
  const [isSelected, setIsSelected] = createSignal(false);
  const [isMoving, setIsMoving] = createSignal(false);

  document.addEventListener("keypress", onKeyPress);
  const rectangle = new fabric.Rect({
    width: props.terrain.widthPx,
    height: props.terrain.heightPx,
    left: props.terrain.center.x - props.terrain.widthPx / 2,
    top: props.terrain.center.y - props.terrain.heightPx / 2,
    selectable: false,
    data: {
      id: props.terrain.id,
      type: ObjectType.Terrain,
    },
  });

  rectangle.on("modified", (e) => {
    updateTerrain(e.target!.data.id, {
      center: {
        x: e.target!.getCenterPoint().x,
        y: e.target!.getCenterPoint().y,
      },
      width: pxToCm(e.target!.getScaledWidth() - 1),
      height: pxToCm(e.target!.getScaledHeight() - 1),
    });
  });

  rectangle.on("selected", (e) => {
    setIsSelected(true);
  });
  rectangle.on("deselected", (e) => {
    setIsSelected(false);
  });

  rectangle.on("moving", (e) => {
    setIsMoving(true);
  });

  rectangle.on("modified", (e) => {
    setIsMoving(false);
  });

  const image = new Image();
  image.src = "src/assets/textures/grass.png";
  image.onload = () => {
    const pattern = new fabric.Pattern({
      source: image,
      repeat: "repeat",
    });
    rectangle.set("fill", pattern);

    rectangle.sendToBack(); // TODO fix z-index
    rectangle.bringForward();
    scene().add(rectangle);
    scene()!.renderAll();
  };

  function onKeyPress(e: KeyboardEvent) {
    const activeObject = scene()?.getActiveObject();
    if (e.key === "Backspace" && activeObject?.data?.id === props.terrain.id) {
      deleteTerrain(props.terrain.id);
      scene().remove(activeObject);
      document.removeEventListener("keypress", onKeyPress);
    }
  }

  onCleanup(() => {
    scene().remove(rectangle);
    document.removeEventListener("keypress", onKeyPress);
  });

  return (
    <>
      <Show when={isSelected() && !isMoving()}>
        <Index each={pointsToEdges(rectangle.getCoords(true))}>
          {(item, index) => {
            const topPadding = {
              0: -40,
              2: 40,
            }[index];
            const leftPadding = {
              1: 40,
              3: -40,
            }[index];
            return (
              <TerrainEdgeDimension
                edge={item()}
                topPadding={topPadding}
                leftPadding={leftPadding}
              />
            );
          }}
        </Index>
      </Show>
    </>
  );
}
