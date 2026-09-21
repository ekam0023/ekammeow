import { useLayoutEffect, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const MODEL = "/models/snack-bar.glb";
const COLOR = "/models/snack-bar-color.jpg";
const NORMAL = "/models/snack-bar-normal.jpg";
const ROUGH = "/models/snack-bar-rough.jpg";

export function preloadSnackBar() {
  useGLTF.preload(MODEL, false, false);
  useTexture.preload(COLOR);
  useTexture.preload(NORMAL);
  useTexture.preload(ROUGH);
}

interface SnackBarModelProps {
  accent?: string;
}

export function SnackBarModel({ accent = "#ffffff" }: SnackBarModelProps) {
  const gltf = useGLTF(MODEL, false, false);
  const [map, normalMap, roughnessMap] = useTexture([COLOR, NORMAL, ROUGH]);

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    cloned.position.sub(center);
    const max = Math.max(size.x, size.y, size.z, 0.0001);
    cloned.scale.setScalar(1 / max);
    return cloned;
  }, [gltf.scene]);

  useLayoutEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    map.needsUpdate = true;
    normalMap.anisotropy = 8;
    roughnessMap.colorSpace = THREE.NoColorSpace;
    roughnessMap.anisotropy = 8;

    const material = new THREE.MeshPhysicalMaterial({
      map,
      normalMap,
      normalScale: new THREE.Vector2(1, 1),
      roughnessMap,
      roughness: 0.72,
      metalness: 0.04,
      clearcoat: 0.28,
      clearcoatRoughness: 0.42,
      sheen: 0.18,
      sheenColor: new THREE.Color("#C98245"),
      sheenRoughness: 0.6,
      color: new THREE.Color(accent),
      envMapIntensity: 0.7,
    });

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.material = material;
    });

    return () => {
      material.dispose();
    };
  }, [scene, map, normalMap, roughnessMap, accent]);

  return <primitive object={scene} />;
}
