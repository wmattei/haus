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
import { Object, Schema } from "./schema";

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

type FloorPlanContext = {
  viewMode: Accessor<"3d" | "2d">;
  setViewMode: (mode: "3d" | "2d") => void;

  schema: Schema;

  addObjects: (objects: Object[]) => void;
  updateObject: <T extends Object>(id: string, data: Partial<T>) => void;
  deleteObject: (id: string) => void;
};

const FloorPlanContext = createContext<FloorPlanContext>({
  viewMode: () => "3d",
} as FloorPlanContext);

type FloorPlanContextProps = {
  children: JSX.Element;
};

export function FloorPlanProvider(props: FloorPlanContextProps) {
  const [viewMode, setViewMode] = createSignal<"3d" | "2d">("2d");
  const [schema, setSchema] = createStore<Schema>({ objects: [] });

  onMount(() => {
    const saved = localStorage.getItem("floorPlan");
    if (saved) {
      const loadedSchema = JSON.parse(saved);
      setSchema(loadedSchema);
    }

    const savedViewMode = localStorage.getItem("viewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode as "2d" | "3d");
    }
  });

  function addObjects(objects: Object[]) {
    setSchema("objects", (existingObjects) => [...existingObjects, ...objects]);
    saveState();
  }

  function updateObject<T extends Object>(id: string, data: Partial<T>) {
    for (const key in data) {
      setSchema(
        "objects",
        (object) => object.id === id,
        key as keyof Object,
        data[key as keyof Object]!
      );
    }
    saveState();
  }

  function deleteObject(id: string) {
    setSchema("objects", (currentObjects) =>
      currentObjects.filter((t) => t.id !== id)
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
        addObjects,
        updateObject,
        deleteObject,
      }}
    >
      {props.children}
    </FloorPlanContext.Provider>
  );
}

export function useFloorPlanContext() {
  return useContext(FloorPlanContext);
}
