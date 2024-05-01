import * as T3 from "three";

export interface IGlobePoint {
  latitude: number
  longitude: number
}

export const createSkyBox = () => {
  const tLoader = new T3.CubeTextureLoader()
  const texture = tLoader.load([
    './images/skybox/right.png',
    './images/skybox/left.png',
    './images/skybox/top.png',
    './images/skybox/bottom.png',
    './images/skybox/front.png',
    './images/skybox/back.png',
  ])
  return texture
}

export const createEarth = () => {
  const tLoader = new T3.TextureLoader();
  const map = tLoader.load("./images/earth/map.jpg");
  const bumpMap = tLoader.load("./images/earth/bump.jpg");
  const specularMap = tLoader.load("./images/earth/spec.jpg");
  const earthSphere = new T3.SphereGeometry(10, 32, 32);
  const earthMaterial = new T3.MeshPhongMaterial({
    map,
    bumpMap,
    bumpScale: 0.1,
    specularMap,
    specular: new T3.Color("grey"),
  });
  const earth = new T3.Mesh(earthSphere, earthMaterial);
  return earth;
};

export const createEarthClouds = () => {
  const tLoader = new T3.TextureLoader();
  const map = tLoader.load("./images/earth/clouds.jpg");
  const geometry = new T3.SphereGeometry(10, 32, 32);
  const material = new T3.MeshLambertMaterial({
    map,
    opacity: 0.4,
    color: 0xffffff,
    transparent: true,
  });
  const res = new T3.Mesh(geometry, material);
  res.scale.set(1.015, 1.015, 1.015)
  return res;
};

export const drawDefaultMarker = (v: IGlobePoint): T3.Mesh => {
  const geometry = new T3.SphereGeometry(.1, 32, 32)
  const lat = v.latitude * (Math.PI / 180.0)
  const lon = -v.longitude * (Math.PI / 180.0)
  const radius = 10

  const material = new T3.MeshBasicMaterial({
    color: "#33B5E5"
  })

  const mesh = new T3.Mesh(geometry, material)
  mesh.position.set(
    Math.cos(lat) * Math.cos(lon) * radius,
    Math.sin(lat) * radius,
    Math.cos(lat) * Math.sin(lon) * radius
  )

  mesh.rotation.set(0.0, -lon, lat - Math.PI * 0.5)

  mesh.userData

  return mesh
}
