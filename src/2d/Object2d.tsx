import { Match, Switch } from "solid-js";
import { ObjectType } from "../floorplan/objectType";
import { Object } from "../floorplan/schema";
import { Terrain } from "../floorplan/terrain";
import { Wall } from "../floorplan/wall";
import { Wall2dObject } from "./Wall";
import { Terrain2dObject } from "./terrain/TerrainObject";

type Props = {
  object: Object;
};

export function Object2D(props: Props) {
  return (
    <Switch>
      <Match when={props.object.objectType === ObjectType.Wall}>
        <Wall2dObject wall={props.object as Wall} />
      </Match>
      <Match when={props.object.objectType === ObjectType.Terrain}>
        <Terrain2dObject terrain={props.object as Terrain} />
      </Match>
    </Switch>
  );
}
