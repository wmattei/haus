import { fabric } from "fabric";
import { Terrain } from "../floorplan/terrain";
import { useSceneContext } from "./Scene";
import { Wall } from "../floorplan/wall";
import { cmToPx } from "../utils/dimensions";

type Props = {
  wall: Wall;
};

export function Wall2dObject(props: Props) {
  const { scene } = useSceneContext()!;

  const line = new fabric.Line(
    [
      props.wall.edge.start.x,
      props.wall.edge.start.y,
      props.wall.edge.end.x,
      props.wall.edge.end.y,
    ],
    {
      stroke: "black",
      strokeWidth: cmToPx(10),
      selectable: false,
      evented: false,
    }
  );

  line.bringToFront();

  scene().add(line);

  return null;
}
