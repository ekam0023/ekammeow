import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE } from "@/lib/palette";
import { useScene } from "@/lib/scene-store";
import { SnackBarModel, preloadSnackBar } from "@/components/three/SnackBarModel";

preloadSnackBar();

function Bar() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;
    const p = useScene.getState().cta;
    const dt = Math.min(delta, 0.05);
    node.rotation.y += dt * 0.32;
    node.rotation.x = 1.15 + Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    node.position.z = THREE.MathUtils.lerp(0, -2.2, p);
    node.position.y = THREE.MathUtils.lerp(-0.08, 0.4, p);
    node.scale.setScalar(THREE.MathUtils.lerp(1.85, 1.05, p));
  });

  return (
    <group ref={group} rotation={[1.15, 0.4, 0.06]} scale={1.85} position={[0, -0.08, 0]}>
      <SnackBarModel />
    </group>
  );
}

export default function CtaCanvas() {
  const mobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : true;

  return (
    <Canvas
      dpr={mobile ? [1, 1.2] : [1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 0.28, 3.2], fov: 34 }}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
        gl.setClearColor(PALETTE.cocoaDeep, 1);
        scene.background = new THREE.Color(PALETTE.cocoaDeep);
      }}
    >
      <color attach="background" args={[PALETTE.cocoaDeep]} />
      <ambientLight intensity={0.5} />
      <spotLight
        position={[3, 4.4, 3.2]}
        intensity={55}
        angle={0.45}
        penumbra={1}
        color="#FFE4C4"
      />
      <pointLight position={[-2.4, 1.2, 2]} intensity={10} color="#FFF5E8" />
      <Bar />
      {!mobile ? (
        <ContactShadows
          position={[0, -0.75, 0]}
          opacity={0.45}
          scale={6}
          blur={2.2}
        />
      ) : null}
    </Canvas>
  );
}
