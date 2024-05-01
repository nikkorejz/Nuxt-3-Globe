<template>
  <div class="Globe" ref="root" />
</template>

<script setup lang="ts">
import * as T3 from "three";
import { OrbitControls } from "three/addons";
import { createEarth, createEarthClouds, createSkyBox, drawDefaultMarker, type IGlobePoint } from "./utils";

interface IComponentProps {
  markers?: Array<IGlobePoint>
  drawMarker?: (v: IGlobePoint) => T3.Mesh
  drawMarkers?: (s: T3.Mesh, v: Array<IGlobePoint>) => void
}

const { markers, drawMarker, drawMarkers } = defineProps<IComponentProps>()

const root = ref<HTMLDivElement | undefined>();
const animationId = ref<number>(0)

const scene = new T3.Scene();
const camera = new T3.PerspectiveCamera();
const renderer = new T3.WebGLRenderer({
  antialias: true
});
const raycaster = new T3.Raycaster()
const mouse = new T3.Vector2()
const touch = new T3.Vector2()

const getW = () => unref(root)?.clientWidth ?? innerWidth
const getH = () => unref(root)?.clientHeight ?? innerHeight

const setupCamera = () => {
  const w = getW();
  const h = getH();
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
};

const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 15
controls.maxDistance = 45
controls.enablePan = false;
controls.update()
controls.saveState()

camera.position.z = 20;

scene.background = createSkyBox()

const earth = createEarth()
const earthClouds = createEarthClouds()
earth.add(earthClouds)
scene.add(earth);

const createLights = () => {
  const lights: T3.Light[] = [];
  lights.push(new T3.PointLight("#004d99", 0.5, 0));
  lights.push(new T3.PointLight("#004d99", 0.5, 0));
  lights.push(new T3.PointLight("#004d99", 0.7, 0));
  lights.push(new T3.AmbientLight("#ffffff"));

  lights[0].position.set(200, 0, -400);
  lights[1].position.set(200, 200, 400);
  lights[2].position.set(-200, -200, -50);
  return lights;
};

scene.add(...createLights());

if (markers) {
  if (!!drawMarkers) {
    drawMarkers(earthClouds, markers)
  } else {
    earthClouds.add(...(markers.map(marker => drawMarker?.(marker) ?? drawDefaultMarker(marker))))
  }
}

const onResize = () => {
  setupCamera();
};

const onInteract = (event: MouseEvent) => {
  event.preventDefault()

  const w = getW();
  const h = getH();

  mouse.x = (event.clientX / w) * 2 - 1
  mouse.y = - (event.clientY / h) * 2 + 1
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(earthClouds.children)
  intersects.forEach(i => {
    console.log(i);
    
  })
}

onMounted(() => {
  unref(root)!.appendChild(renderer.domElement);
  setupCamera();

  addEventListener("resize", onResize);
  addEventListener('click', onInteract)

  const animate = () => {
    animationId.value = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();
});

onBeforeUnmount(() => {
  removeEventListener("resize", onResize);
  removeEventListener('click', onInteract);

  cancelAnimationFrame(unref(animationId))

  let i = earthClouds.children.length
  while (i--) {
    const c: T3.Mesh = earthClouds.children[i] as T3.Mesh

    if (Array.isArray(c.material)) {
      c.material.forEach(m => m.dispose())
    } else {
      c.material.dispose()
    }

    c.geometry.dispose()

    earthClouds.remove(earthClouds.children[i])
  }
});
</script>

<style scoped>
.Globe {
  width: 100%;
  height: 100%;
}
</style>
