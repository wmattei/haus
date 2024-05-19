import { fabric } from "fabric";
import {
  Accessor,
  JSX,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";

import { Vertex } from "../vertex";
import { useFloorPlanContext } from "../floorplan/FloorplanProvider";

type SceneContext = {
  scene: Accessor<fabric.Canvas>;
  selectedTool: Accessor<"pan" | "select">;
  onSelectionToolChanged: (tool: "pan" | "select") => void;
};

export const SceneContext = createContext<SceneContext>();

type Scene2DProps = {
  name: string;
  width: number;
  height: number;
  children?: JSX.Element;
};

const CELL_SIZE = 100;

export function Scene2D(props: Scene2DProps) {
  const [scene, setScene] = createSignal<fabric.Canvas>();
  const [dragging, setDragging] = createSignal(false);
  const [lastPos, setLastPos] = createSignal<Vertex>({ x: 0, y: 0 });
  const [selectedTool, setSelectedTool] = createSignal<"pan" | "select">("pan");

  const { viewMode, schema } = useFloorPlanContext();

  let canvas: HTMLCanvasElement;

  function onSelectionToolChanged(tool: "pan" | "select") {
    const c = scene()!;
    setSelectedTool(tool);
    c.discardActiveObject();
    c.requestRenderAll();

    if (tool === "pan") {
      c.on("mouse:up", onMouseUp);
      c.on("mouse:down", onMouseDown);
      c.on("mouse:move", onMouseMove);
      c.defaultCursor = "grab";
      c.forEachObject((o) => {
        o!.evented = false;
      });
    } else {
      c.off("mouse:up", onMouseUp);
      c.off("mouse:down", onMouseDown as any);
      c.off("mouse:move", onMouseMove as any);
      c.forEachObject((o) => {
        o!.evented = true;
      });
      c.defaultCursor = "default";
    }
  }

  onMount(() => {
    const c = new fabric.Canvas(canvas, {
      selectionColor: "rgba(100,100,100,0.3)",
      selectionLineWidth: 2,
      width: props.width,
      height: props.height,
      viewportTransform: [1, 0, 0, 1, -props.width / 2, -props.height / 2],
      fireRightClick: true,
      fireMiddleClick: true,
    });

    setScene(c);
    onSelectionToolChanged("pan");

    c.on("object:added", function (e) {
      e.target!.evented = selectedTool() === "select";
    });

    const grid = fabric.util.createClass(fabric.Object, {
      type: "infBGrid",

      render: function (ctx: CanvasRenderingContext2D) {
        let zoom = c.getZoom();
        let offX = c.viewportTransform![4];
        let offY = c.viewportTransform![5];

        ctx.save();
        ctx.strokeStyle = "#cecece";
        ctx.lineWidth = 1;

        let gridSize = CELL_SIZE * zoom;

        const numCellsX = Math.ceil(canvas.width / gridSize);
        const numCellsY = Math.ceil(canvas.height / gridSize);

        let gridOffsetX = offX % gridSize;
        let gridOffsetY = offY % gridSize;
        ctx.beginPath();

        for (let i = 0; i <= numCellsX; i++) {
          let x = gridOffsetX + i * gridSize;
          ctx.moveTo((x - offX) / zoom, (0 - offY) / zoom);
          ctx.lineTo((x - offX) / zoom, (canvas.height - offY) / zoom);
        }

        for (let i = 0; i <= numCellsY; i++) {
          let y = gridOffsetY + i * gridSize;
          ctx.moveTo((0 - offX) / zoom, (y - offY) / zoom);
          ctx.lineTo((canvas.width - offX) / zoom, (y - offY) / zoom);
        }

        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      },
    });

    const bg = new grid();

    c.add(bg);
    c.renderAll();
  });

  createEffect(() => {
    const c = scene();
    c?.setHeight(viewMode() !== "2d" ? 0 : props.height);
  });

  function onMouseDown(opt: fabric.IEvent<MouseEvent>) {
    if (opt.e.button === 0) {
      const c = scene()!;
      c.setCursor("grab");
      const selected = c.getActiveObject();
      if (selected) return;
      c.selection = false;
      setDragging(true);
      setLastPos({ x: opt.e.clientX, y: opt.e.clientY });
    }
  }

  function onMouseMove(opt: fabric.IEvent<MouseEvent>) {
    if (dragging()) {
      const c = scene()!;
      c.setCursor("grabbing");
      c.viewportTransform![4] += opt.e.clientX - lastPos().x;
      c.viewportTransform![5] += opt.e.clientY - lastPos().y;

      setLastPos({ x: opt.e.clientX, y: opt.e.clientY });

      c.requestRenderAll();
    }
  }

  function onMouseUp() {
    const c = scene()!;
    c.setCursor("default");
    c.setViewportTransform(scene()!.viewportTransform!);
    c.selection = true;
    setDragging(false);
  }

  return (
    <SceneContext.Provider
      value={{
        scene: scene as Accessor<fabric.Canvas>,
        onSelectionToolChanged,
        selectedTool,
      }}
    >
      {props.children}
      <canvas
        ref={(el) => {
          canvas = el;
        }}
        id={props.name}
      ></canvas>
    </SceneContext.Provider>
  );
}

export function useSceneContext() {
  return useContext(SceneContext);
}
