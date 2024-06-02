import { fabric } from "fabric";
import { Show, createEffect, createSignal, onCleanup } from "solid-js";
import { useSceneContext } from "../Scene";
import { pxToCm } from "../../utils/dimensions";
import { Edge, getEdgeCenter, getEdgeSize } from "../../edge";
import { EdgeSizeControl } from "../components/EdgeSizeControl";

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

export function TerrainEdgeDimension(props: TerrainEdgeDimensionProps) {
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
    hoverCursor: "text",
  });

  const box = new fabric.Rect({
    width: text.getBoundingRect(true).width + 10,
    height: text.getBoundingRect(true).height + 10,
    left: text.getBoundingRect(true).left - 5,
    top: text.getBoundingRect(true).top - 5,
    fill: "white",
    stroke: "black",
    strokeWidth: 1,
    selectable: false,
    evented: false,
    hoverCursor: "text",
  });

  const group = new fabric.Group([box, text], {
    hasControls: false,
    visible: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: "text",
  });

  scene().on("mouse:over", (e) => {
    if (e.target === group) {
      group.animate("scaleX", 1.5, {
        duration: 200,
        onChange: scene().renderAll.bind(scene()),
      });
      group.animate("scaleY", 1.5, {
        duration: 200,
        onChange: scene().renderAll.bind(scene()),
      });
    }
  });
  scene().on("mouse:out", (e) => {
    if (e.target === group) {
      group.animate("scaleX", 1, {
        duration: 200,
        onChange: scene().renderAll.bind(scene()),
      });
      group.animate("scaleY", 1, {
        duration: 200,
        onChange: scene().renderAll.bind(scene()),
      });
    }
  });

  group.on("selected", (e) => {
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

  group.on("deselected", (e) => {
    setIsSelected(false);
  });

  createEffect(() => {
    group.visible = props.visible || isSelected();
  });

  scene()!.add(group);
  scene()!.renderAll();

  onCleanup(() => {
    scene()!.remove(group);
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
