import type { Component } from "solid-js";
import { FloorPlanProvider } from "./floorplan/FloorplanProvider";
import { GuidanceProvider } from "./guidance/GuidanceContext";
import { ViewMode } from "./tools/ViewMode";
import { Views } from "./views/Views";

const App: Component = () => {
  return (
    <GuidanceProvider>
      <FloorPlanProvider>
        <Views />
        <ViewMode />
      </FloorPlanProvider>
    </GuidanceProvider>
  );
};

export default App;
