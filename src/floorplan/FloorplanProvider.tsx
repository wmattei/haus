import {
  Accessor,
  JSX,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Schema } from "./schema";
import { Terrain } from "./terrain";
import { Wall } from "./wall";

type FloorPlanContext = {
  viewMode: Accessor<"3d" | "2d">;
  setViewMode: (mode: "3d" | "2d") => void;

  schema: Schema;

  addWalls: (walls: Wall[]) => void;
  addTerrain: (terrain: Terrain) => void;
  updateTerrain: (id: string, data: Partial<Omit<Terrain, "id">>) => void;
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
      setSchema(Schema.fromJson(saved));
    }

    const savedViewMode = localStorage.getItem("viewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode as "2d" | "3d");
    }
  });

  function addWalls(walls: Wall[]) {
    setSchema("walls", (existingWalls) => [...existingWalls, ...walls]);
  }

  function addTerrain(terrain: Terrain) {
    setSchema("terrains", (terrains) => [...terrains, terrain]);
  }

  function updateTerrain(id: string, data: Partial<Omit<Terrain, "id">>) {
    setSchema("terrains", (currentTerrains) =>
      currentTerrains.map((t) =>
        t.id === id ? ({ ...t, ...data } as Terrain) : t
      )
    );
  }

  createEffect(() => {
    console.info("Saving schema");
    const json = JSON.stringify(schema);
    localStorage.setItem("floorPlan", json);
  });

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
      }}
    >
      {props.children}
    </FloorPlanContext.Provider>
  );
}

export function useFloorPlanContext() {
  return useContext(FloorPlanContext);
}
