import { fabric } from "fabric";
import {
  Accessor,
  For,
  JSX,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";

import { useFloorPlanContext } from "../floorplan/FloorplanProvider";
import { Object2D } from "./Object2d";
import { PanControl } from "./PanControl";
import { SelectionControl } from "./SelectionControl";
import { ZoomControl2d } from "./ZoomControl";

type SceneContext = {
  scene: Accessor<fabric.Canvas>;
};

export const SceneContext = createContext<SceneContext>();

type Scene2DProps = {
  name: string;
  width: number;
  height: number;
  children?: JSX.Element;
};

export function Scene2D(props: Scene2DProps) {
  const [scene, setScene] = createSignal<fabric.Canvas>();

  const { viewMode, schema } = useFloorPlanContext();

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const c = new fabric.Canvas(canvas, {
      selectionColor: "rgba(100,100,100,0.3)",
      selectionLineWidth: 2,
      width: props.width,
      height: props.height,
      viewportTransform: [1, 0, 0, 1, props.width, props.height],
      fireRightClick: true,
      fireMiddleClick: true,
      skipOffscreen: true,
    });

    setScene(c);
  });

  createEffect(() => {
    const c = scene();
    c?.setHeight(viewMode() !== "2d" ? 0 : props.height);
  });

  return (
    <SceneContext.Provider
      value={{
        scene: scene as Accessor<fabric.Canvas>,
      }}
    >
      <ZoomControl2d />
      <PanControl />
      <SelectionControl />
      <For each={schema.objects}>
        {(object) => <Object2D object={object} />}
      </For>
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
