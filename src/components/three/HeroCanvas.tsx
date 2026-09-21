import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { ChocolateBar } from "@/components/three/ChocolateBar";
import { preloadSnackBar } from "@/components/three/SnackBarModel";
import { PALETTE } from "@/lib/palette";
import { useScene } from "@/lib/scene-store";
import { prefersReducedMotion } from "@/lib/utils";

preloadSnackBar();

function Rig() {
  const { camera } = useThree();
  useFrame((_, delta) => {
    const p = useScene.getState().hero;
    const dt = Math.min(delta, 0.05);
    const z = THREE.MathUtils.lerp(3.35, 2.15, p);
    const y = THREE.MathUtils.lerp(0.35, 0.12, p);
    camera.position.z += (z - camera.position.z) * Math.min(1, dt * 3.2);
    camera.position.y += (y - camera.position.y) * Math.min(1, dt * 3.2);
    camera.lookAt(0, -0.12, 0);
  });
  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} color={PALETTE.cream} />
      <spotLight
        position={[2.8, 4.2, 3.6]}
        angle={0.5}
        penumbra={0.8}
        intensity={70}
        color="#FFE4C4"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[-3.2, 2.4, 2.2]}
        angle={0.65}
        penumbra={1}
        intensity={28}
        color="#FFF5E8"
      />
      <pointLight position={[0, 1.4, 2.8]} intensity={12} color="#FFD7B0" />
      <pointLight position={[1.8, -0.6, 1.6]} intensity={8} color={PALETTE.caramel} />
    </>
  );
}

export default function HeroCanvas() {
  const reduced = prefersReducedMotion();
  const mobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : true;

  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.35, 3.35], fov: 34 }}
      shadows={!mobile}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.22;
        gl.shadowMap.type = THREE.PCFShadowMap;
        gl.setClearColor(PALETTE.cocoaDeep, 1);
        scene.background = new THREE.Color(PALETTE.cocoaDeep);
      }}
    >
      <color attach="background" args={[PALETTE.cocoaDeep]} />
      <Lights />
      <ChocolateBar />
      {!mobile && !reduced ? (
        <Sparkles
          count={40}
          scale={[6, 3.5, 4]}
          size={1.6}
          speed={0.28}
          color={PALETTE.caramel}
          opacity={0.4}
        />
      ) : null}
      {!mobile ? (
        <ContactShadows
          position={[0, -0.85, 0]}
          opacity={0.55}
          scale={7}
          blur={2.8}
          far={2.6}
        />
      ) : null}
      <Rig />
    </Canvas>
  );
}
