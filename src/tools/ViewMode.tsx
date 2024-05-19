import { createSignal } from "solid-js";
import { useFloorPlanContext } from "../floorplan/FloorplanProvider";

export function ViewMode() {
  const { viewMode, setViewMode } = useFloorPlanContext();

  function Button({ label, name }: { label: string; name: string }) {
    return (
      <button
        onClick={() => setViewMode(name as "3d" | "2d")}
        type="button"
        class={
          "mr-1 text-primary-800 rounded-md p-2  transition-colors duration-200 active:outline active:outline-1"
        }
        classList={{
          "bg-primary-700": viewMode() === name,
          "text-white": viewMode() === name,
          "bg-primary-50": viewMode() !== name,
          "hover:bg-primary-200": viewMode() !== name,
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div class="absolute bottom-8 z-10 w-full flex flex-row items-center justify-center opacity-50 hover:opacity-100 duration-150">
      <div
        class="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border-gray-100 p-1 inline-flex shadow border rounded-md bg-primary-50"
        role="group"
      >
        <Button name="2d" label="2D" />
        <Button name="3d" label="3D" />
      </div>
    </div>
  );
}
