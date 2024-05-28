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
import Stats from "three/examples/jsm/libs/stats.module.js";

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
    const stats = new Stats();
    stats.dom.style.top = "40px";
    stats.dom.style.left = "40px";
    // document.body.appendChild(stats.dom);

    scene.add(camera);

    scene.background = new THREE.Color(0xf0f0f0);
    scene.fog = new THREE.FogExp2(0xaaccff, 0.0007);

    const ambientLight = new THREE.AmbientLight(0xf0f0f0, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 15, 20);
    directionalLight.castShadow = true;

    scene.add(directionalLight);
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight
    );
    scene.add(directionalLightHelper);

    const hemisphericLight = new THREE.HemisphereLight(
      0xf0f0f0,
      THREE.Color.NAMES.black,
      1
    );
    hemisphericLight.position.set(0, 10, 10);
    scene.add(hemisphericLight);

    // const hemisphericLightHelper = new THREE.HemisphereLightHelper(
    //   hemisphericLight,
    //   5,
    //   0xf00000
    // );
    // // scene.add(hemisphericLightHelper);

    const planeGeometry = new THREE.PlaneGeometry(20000, 20000);
    planeGeometry.rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.ShadowMaterial({
      color: 0x000000,
      opacity: 0.2,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -10;
    plane.receiveShadow = false;
    scene.add(plane);

    const gridHelper = new THREE.GridHelper(1000, 1000);
    gridHelper.position.y = -0.001;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    const r = new THREE.WebGLRenderer({ antialias: true, canvas });
    setRenderer(r);
    r.setSize(0, 0);

    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(r.domElement);

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      const deltaTime = clock.getDelta();
      r.render(scene, camera);

      updaters().forEach((u) => u(deltaTime));
      stats.update();
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
      {schema.walls.map((wall) => (
        <WallObject wall={wall} />
      ))}
      {schema.terrains.map((terrain) => (
        <TerrainObject terrain={terrain} />
      ))}
      {props.children}
      <canvas
        style={{
          display: viewMode() !== "3d" ? "none" : "block",
          cursor: "grab",
        }}
        ref={(el) => {
          canvas = el;
        }}
      ></canvas>
    </Scene3DContext.Provider>
  );
}
