import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SnackBarModel } from "@/components/three/SnackBarModel";
import { useScene } from "@/lib/scene-store";

export function ChocolateBar() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;
    const p = useScene.getState().hero;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const floatY = Math.sin(t * 0.75) * 0.05;

    const targetY = 0.55 + p * 1.35;
    node.rotation.y += (targetY - node.rotation.y) * Math.min(1, dt * 4);
    node.rotation.x = THREE.MathUtils.lerp(1.18, 0.92, p);
    node.rotation.z = THREE.MathUtils.lerp(0.08, -0.04, p);
    node.position.y = -0.15 + floatY;
    node.scale.setScalar(THREE.MathUtils.lerp(2.05, 2.55, p));
  });

  return (
    <group ref={group} rotation={[1.18, 0.55, 0.08]} scale={2.05} position={[0, -0.15, 0]}>
      <SnackBarModel />
    </group>
  );
}
