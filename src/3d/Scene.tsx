import {
  Accessor,
  JSX,
  createContext,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import * as THREE from "three";
import { useFloorPlanContext } from "../floorplan/FloorplanProvider";
import { TerrainObject } from "./Terrain";
import { WallObject } from "./Wall";

type Scene3DContext = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: Accessor<THREE.WebGLRenderer | undefined>;
  onUpdate: (db: (delta: number) => void) => void;
};

const Scene3DContext = createContext<Scene3DContext>();

type Props = {
  children: JSX.Element;
};

export function useScene3DContext() {
  return useContext(Scene3DContext);
}

export function Scene3D(props: Props) {
  const { schema, viewMode } = useFloorPlanContext();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const [renderer, setRenderer] = createSignal<THREE.WebGLRenderer>();
  const [updaters, setUpdaters] = createSignal(new Set<(dt: number) => void>());

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const r = new THREE.WebGLRenderer({ antialias: true, canvas });
    setRenderer(r);
    r.setSize(0, 0);

    scene.add(camera);

    scene.background = new THREE.Color(0xffffff);

    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;

    r.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(r.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    light.castShadow = true;

    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 50;
    scene.add(light);

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      const deltaTime = clock.getDelta();
      r.render(scene, camera);

      updaters().forEach((u) => u(deltaTime));
    }
    animate();
  });

  function onUpdate(cb: (dt: number) => void) {
    const newUpdaters = updaters();
    newUpdaters.add(cb);
    setUpdaters(newUpdaters);
  }

  return (
    <Scene3DContext.Provider value={{ scene, camera, renderer, onUpdate }}>
      {schema().walls.map((wall) => (
        <WallObject wall={wall} />
      ))}
      {schema().terrains.map((terrain) => (
        <TerrainObject terrain={terrain} />
      ))}
      {props.children}
      <canvas
        style={{ display: viewMode() !== "3d" ? "none" : "block" }}
        ref={(el) => {
          canvas = el;
        }}
      ></canvas>
    </Scene3DContext.Provider>
  );
}
