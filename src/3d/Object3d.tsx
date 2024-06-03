import { Match, Switch } from "solid-js";
import { ObjectType } from "../floorplan/objectType";
import { Object } from "../floorplan/schema";
import { Terrain } from "../floorplan/terrain";
import { Wall } from "../floorplan/wall";
import { TerrainObject } from "./Terrain";
import { WallObject } from "./Wall";

type Props = {
  object: Object;
};

export function Object3D(props: Props) {
  return (
    <Switch>
      <Match when={props.object.objectType === ObjectType.Wall}>
        <WallObject wall={props.object as Wall} />
      </Match>
      <Match when={props.object.objectType === ObjectType.Terrain}>
        <TerrainObject terrain={props.object as Terrain} />
      </Match>
    </Switch>
  );
}
