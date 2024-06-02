import { fabric } from "fabric";
import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { Edge, getEdgeCenter, getEdgeSize } from "../edge";
import { useFloorPlanContext } from "../floorplan/FloorplanProvider";
import { ObjectType } from "../floorplan/objectType";
import { Terrain } from "../floorplan/terrain";
import { cmToPx, pointsToEdges, pxToCm } from "../utils/dimensions";
import { useSceneContext } from "./Scene";
import { EdgeSizeControl } from "./components/EdgeSizeControl";

type TerrainEdgeDimensionProps = {
  edge: Edge;
  topPadding?: number;
  leftPadding?: number;
  visible?: boolean;
  onApplyPrimary: (value: number) => void;
  onApplySecondary: (value: number) => void;
  primaryLabel: string;
  secondaryLabel: string;

  direction: "horizontal" | "vertical";
};

function TerrainEdgeDimension(props: TerrainEdgeDimensionProps) {
  const { scene } = useSceneContext()!;
  const [isSelected, setIsSelected] = createSignal(false);
  const [value, setValue] = createSignal(
    pxToCm(Math.ceil(getEdgeSize(props.edge)))
  );
  const [position, setPosition] = createSignal({ x: 0, y: 0 });

  const content = `${value()} cm`;

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
  const edgeCenter = getEdgeCenter(props.edge);

  const text = new fabric.Text(content, {
    left: edgeCenter.x + leftPadding,
    top: edgeCenter.y + topPadding,
    fontSize: 20,
    hasBorders: false,
    hasControls: false,
    visible: false,
  });

  const box = new fabric.Rect({
    width: text.getBoundingRect(true).width,
    height: text.getBoundingRect(true).height,
    left: text.getBoundingRect(true).left,
    top: text.getBoundingRect(true).top,
    fill: "white",
    stroke: "black",
    strokeWidth: 1,
    selectable: false,
    evented: false,
    visible: false,
  });

  text.on("selected", (e) => {
    const offsetX = props.direction === "horizontal" ? 120 : 5;
    const offsetY = props.direction === "horizontal" ? 5 : 120;
    setPosition({
      x: e.target?.getBoundingRect().left! - offsetX,
      y: e.target?.getBoundingRect().top! - offsetY,
    });
    setIsSelected(true);

    scene().on("zoom", () => {
      setPosition({
        x: e.target?.getBoundingRect().left! - offsetX,
        y: e.target?.getBoundingRect().top! - offsetY,
      });
    });
    scene().on("move", () => {
      setPosition({
        x: e.target?.getBoundingRect().left! - offsetX,
        y: e.target?.getBoundingRect().top! - offsetY,
      });
    });
  });

  text.on("deselected", (e) => {
    setIsSelected(false);
  });

  createEffect(() => {
    text.visible = props.visible || isSelected();
    box.visible = props.visible || isSelected();
  });

  scene()!.add(box);
  scene()!.add(text);
  scene()!.renderAll();

  onCleanup(() => {
    scene()!.remove(text);
    scene()!.remove(box);
    scene()!.renderAll();
  });

  return (
    <Show when={isSelected()}>
      <EdgeSizeControl
        direction={props.direction}
        onApplyPrimary={() => props.onApplyPrimary(value())}
        onApplySecondary={() => props.onApplySecondary(value())}
        primaryLabel={props.primaryLabel}
        secondaryLabel={props.secondaryLabel}
        position={position()}
        setValue={setValue}
        value={value()}
      />
    </Show>
  );
}

type Terrain2dObjectProps = {
  terrain: Terrain;
};

export function Terrain2dObject(props: Terrain2dObjectProps) {
  const { scene } = useSceneContext()!;
  const { deleteTerrain, updateTerrain } = useFloorPlanContext();
  const [isSelected, setIsSelected] = createSignal(false);
  const [isMoving, setIsMoving] = createSignal(false);
  const [edges, setEdges] = createSignal<Edge[]>([]);

  document.addEventListener("keypress", onKeyPress);
  const rectangle = new fabric.Rect({
    width: cmToPx(props.terrain.width),
    height: cmToPx(props.terrain.height),
    left: props.terrain.center.x - cmToPx(props.terrain.width) / 2,
    top: props.terrain.center.y - cmToPx(props.terrain.height) / 2,
    selectable: false,
    data: {
      id: props.terrain.id,
      type: ObjectType.Terrain,
    },
    transparentCorners: false,
    lockSkewingX: true,
    lockSkewingY: true,
  });

  rectangle.setControlsVisibility({
    tl: false,
    tr: false,
    br: false,
    bl: false,
    mtr: false,
  });

  setEdges(pointsToEdges(rectangle.getCoords(true)));

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

  rectangle.on("scaling", (e) => {
    setEdges(pointsToEdges(rectangle.getCoords(true, true)));
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

  createEffect(() => {
    props.terrain.center.x;
    props.terrain.center.y;
    props.terrain.height;
    props.terrain.width;
    const edges = pointsToEdges(rectangle.getCoords(true, true));
    setEdges(edges);
  });

  onCleanup(() => {
    scene().remove(rectangle);
    document.removeEventListener("keypress", onKeyPress);
  });

  return (
    <>
      <Show when={!isMoving()}>
        <For each={edges()}>
          {(item, index) => {
            const topPadding = {
              0: -40,
              2: 40,
            }[index()];
            const leftPadding = {
              1: 40,
              3: -40,
            }[index()];

            const onApplyPrimary = (value: number) => {
              if (index() === 1 || index() === 3) {
                const heightDiff = cmToPx(value) - rectangle.height!;
                rectangle.set({
                  top: rectangle.top! - heightDiff,
                  height: cmToPx(value),
                });
              }
              if (index() === 0 || index() === 2) {
                const widthDiff = cmToPx(value) - rectangle.width!;
                rectangle.set({
                  left: rectangle.left! - widthDiff,
                  width: cmToPx(value),
                });
              }
              updateTerrain(props.terrain.id, {
                center: {
                  x: rectangle.getCenterPoint().x,
                  y: rectangle.getCenterPoint().y,
                },
                width: pxToCm(rectangle.getScaledWidth() - 1),
                height: pxToCm(rectangle.getScaledHeight() - 1),
              });
              scene().renderAll();
            };

            const onApplySecondary = (value: number) => {
              if (index() === 1 || index() === 3) {
                rectangle.height = cmToPx(value);
              }
              if (index() === 0 || index() === 2) {
                rectangle.width = cmToPx(value);
              }
              updateTerrain(props.terrain.id, {
                center: {
                  x: rectangle.getCenterPoint().x,
                  y: rectangle.getCenterPoint().y,
                },
                width: pxToCm(rectangle.getScaledWidth() - 1),
                height: pxToCm(rectangle.getScaledHeight() - 1),
              });
              scene().renderAll();
            };
            const primaryLabel = {
              0: "Apply Left",
              1: "Apply Above",
              2: "Apply Left",
              3: "Apply Above",
            }[index()];

            const secondaryLabel = {
              0: "Apply Right",
              1: "Apply Below",
              2: "Apply Right",
              3: "Apply Below",
            }[index()];

            return (
              <TerrainEdgeDimension
                edge={item}
                visible={isSelected()}
                topPadding={topPadding}
                leftPadding={leftPadding}
                onApplyPrimary={onApplyPrimary}
                onApplySecondary={onApplySecondary}
                primaryLabel={primaryLabel!}
                secondaryLabel={secondaryLabel!}
                direction={
                  index() === 0 || index() === 2 ? "horizontal" : "vertical"
                }
              />
            );
          }}
        </For>
      </Show>
    </>
  );
}
