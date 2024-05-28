import { fabric } from "fabric";
import { onMount } from "solid-js";
import { ObjectType } from "../floorplan/objectType";
import { Terrain } from "../floorplan/terrain";
import { useSceneContext } from "./Scene";

type Props = {
  terrain: Terrain;
};

export function Terrain2dObject(props: Props) {
  const { scene } = useSceneContext()!;

  onMount(() => {
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

    const image = new Image();
    image.src = "src/assets/textures/grass.png";
    image.onload = () => {
      const pattern = new fabric.Pattern({
        source: image,
        repeat: "repeat",
      });
      rectangle.set("fill", pattern);
      scene().add(rectangle);
      scene()!.renderAll();

      rectangle.sendToBack(); // TODO fix z-index
      rectangle.bringForward();
    };
  });

  return null;
}
