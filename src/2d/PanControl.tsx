import { createSignal, onMount } from "solid-js";
import { useSceneContext } from "./Scene";
import { Vertex } from "../vertex";
import { fabric } from "fabric";

const CELL_SIZE = 100;

export function PanControl() {
  const { scene } = useSceneContext()!;
  const [dragging, setDragging] = createSignal(false);
  const [lastPos, setLastPos] = createSignal<Vertex>({ x: 0, y: 0 });

  onMount(() => {
    const c = scene();
    c.on("mouse:up", onMouseUp);
    c.on("mouse:down", onMouseDown);
    c.on("mouse:move", onMouseMove);
    c.defaultCursor = "grab";

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

        const numCellsX = Math.ceil(c.getWidth() / gridSize);
        const numCellsY = Math.ceil(c.getHeight() / gridSize);

        let gridOffsetX = offX % gridSize;
        let gridOffsetY = offY % gridSize;
        ctx.beginPath();

        for (let i = 0; i <= numCellsX; i++) {
          let x = gridOffsetX + i * gridSize;
          ctx.moveTo((x - offX) / zoom, (0 - offY) / zoom);
          ctx.lineTo((x - offX) / zoom, (c.getHeight() - offY) / zoom);
        }

        for (let i = 0; i <= numCellsY; i++) {
          let y = gridOffsetY + i * gridSize;
          ctx.moveTo((0 - offX) / zoom, (y - offY) / zoom);
          ctx.lineTo((c.getWidth() - offX) / zoom, (y - offY) / zoom);
        }

        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      },
    });

    const bg = new grid();

    c.add(bg);
    c.renderAll();

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
        const deltaX = opt.e.clientX - lastPos().x;
        const deltaY = opt.e.clientY - lastPos().y;
        c.viewportTransform![4] += deltaX;
        c.viewportTransform![5] += deltaY;

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
  });

  return null;
}
