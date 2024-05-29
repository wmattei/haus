import {
  Accessor,
  JSX,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { Part, createStore } from "solid-js/store";
import { Schema } from "./schema";
import { Terrain } from "./terrain";
import { Wall } from "./wall";

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

type FloorPlanContext = {
  viewMode: Accessor<"3d" | "2d">;
  setViewMode: (mode: "3d" | "2d") => void;

  schema: Schema;

  addWalls: (walls: Wall[]) => void;
  addTerrain: (terrain: Terrain) => void;
  updateTerrain: (id: string, data: Partial<Omit<Terrain, "id">>) => void;
  deleteTerrain: (id: string) => void;
};

const FloorPlanContext = createContext<FloorPlanContext>({
  viewMode: () => "3d",
} as FloorPlanContext);

type FloorPlanContextProps = {
  children: JSX.Element;
};

export function FloorPlanProvider(props: FloorPlanContextProps) {
  const [viewMode, setViewMode] = createSignal<"3d" | "2d">("2d");
  const [schema, setSchema] = createStore<Schema>(new Schema([], []));

  onMount(() => {
    const saved = localStorage.getItem("floorPlan");
    if (saved) {
      const loadedSchema = Schema.fromJson(saved);
      setSchema(loadedSchema);
      setSchema("terrains", loadedSchema.terrains);
    }

    const savedViewMode = localStorage.getItem("viewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode as "2d" | "3d");
    }
  });

  function addWalls(walls: Wall[]) {
    setSchema("walls", (existingWalls) => [...existingWalls, ...walls]);
    saveState();
  }

  function addTerrain(terrain: Terrain) {
    setSchema("terrains", (terrains) => [...terrains, terrain]);
    saveState();
  }

  function updateTerrain(
    id: string,
    data: Partial<NonFunctionProperties<Terrain>>
  ) {
    const index = schema.findTerrainIndex(id);
    const newTerrain = { ...schema.terrains[index], ...data };
    Object.setPrototypeOf(newTerrain, Terrain.prototype);
    setSchema("terrains", index, newTerrain);
    saveState();
  }

  function deleteTerrain(id: string) {
    setSchema("terrains", (currentTerrains) =>
      currentTerrains.filter((t) => t.id !== id)
    );
    saveState();
  }

  function saveState() {
    const json = JSON.stringify(schema);
    localStorage.setItem("floorPlan", json);
  }

  createEffect(() => {
    localStorage.setItem("viewMode", viewMode());
  });

  return (
    <FloorPlanContext.Provider
      value={{
        viewMode,
        setViewMode,
        schema,
        addWalls,
        addTerrain,
        updateTerrain,
        deleteTerrain,
      }}
    >
      {props.children}
    </FloorPlanContext.Provider>
  );
}

export function useFloorPlanContext() {
  return useContext(FloorPlanContext);
}
