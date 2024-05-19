import { Scene2D } from "../2d/Scene";
import { ZoomControl2d } from "../2d/ZoomControl";
import { Scene3D } from "../3d/Scene";
import { ZoomControl3d } from "../3d/ZoomControl";
import { useFloorPlanContext } from "../floorplan/FloorplanProvider";
import { LeftSideBar } from "../tools/LeftSideBar";

export function Views() {
  const { viewMode } = useFloorPlanContext();
  return (
    <>
      <Scene2D height={innerHeight} width={innerWidth} name="BaseScene">
        {viewMode() === "2d" && <LeftSideBar />}
        <ZoomControl2d />
      </Scene2D>
      <Scene3D>
        <ZoomControl3d />
      </Scene3D>
    </>
  );
}
