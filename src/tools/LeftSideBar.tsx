import { AddTerrain } from "./terrain/AddTerrain";
import { AddWall } from "./wall/AddWall";

export function LeftSideBar() {
  return (
    <div class="absolute left-4 z-10 h-full flex flex-row items-center justify-center">
      <div
        class="p-1 flex flex-col shadow border rounded-md bg-primary-50"
        role="group"
      >
        <AddTerrain />
        <AddWall />
      </div>
    </div>
  );
}
