import {
  Accessor,
  JSX,
  createContext,
  createSignal,
  useContext,
} from "solid-js";
import { Schema } from "./schema";
import { Terrain } from "./terrain";
import { Wall } from "./wall";

type FloorPlanContext = {
  viewMode: Accessor<"3d" | "2d">;
  setViewMode: (mode: "3d" | "2d") => void;

  schema: Accessor<Schema>;
  addWalls: (walls: Wall[]) => void;
  addTerrain: (terrain: Terrain) => void;
};

const FloorPlanContext = createContext<FloorPlanContext>({
  viewMode: () => "3d",
} as FloorPlanContext);

type FloorPlanContextProps = {
  children: JSX.Element;
};

const initialSchema: Schema = {
  walls: [],
  terrains: [new Terrain(1200, 2500, { x: 0, y: 0 })],
};

export function FloorPlanProvider(props: FloorPlanContextProps) {
  const [viewMode, setViewMode] = createSignal<"3d" | "2d">("3d");
  const [schema, setSchema] = createSignal<Schema>(initialSchema);

  function addWalls(walls: Wall[]) {
    const s = schema();
    s.walls.push(...walls);
    setSchema(s);
  }
  function addTerrain(terrain: Terrain) {
    const s = schema();
    s.terrains.push(terrain);
    setSchema({ ...s });
  }
  return (
    <FloorPlanContext.Provider
      value={{ viewMode, setViewMode, schema, addWalls, addTerrain }}
    >
      {props.children}
    </FloorPlanContext.Provider>
  );
}

export function useFloorPlanContext() {
  return useContext(FloorPlanContext);
}
