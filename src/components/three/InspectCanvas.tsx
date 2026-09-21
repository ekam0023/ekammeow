import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE } from "@/lib/palette";
import { SnackBarModel, preloadSnackBar } from "@/components/three/SnackBarModel";

preloadSnackBar();

export default function InspectCanvas() {
  const mobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : true;

  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.28, 2.85], fov: 36 }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
        gl.setClearColor(PALETTE.cocoa, 1);
        scene.background = new THREE.Color(PALETTE.cocoa);
      }}
    >
      <color attach="background" args={[PALETTE.cocoa]} />
      <ambientLight intensity={0.52} color={PALETTE.cream} />
      <spotLight
        position={[2.8, 4.2, 3.2]}
        angle={0.48}
        penumbra={0.85}
        intensity={60}
        color="#FFE4C4"
      />
      <spotLight
        position={[-2.8, 1.8, 1.8]}
        angle={0.6}
        penumbra={1}
        intensity={18}
        color="#FFF5E8"
      />
      <pointLight position={[0, 0.8, 2.2]} intensity={8} color="#FFD7B0" />
      <group rotation={[1.12, 0.55, 0.06]} scale={1.9} position={[0, -0.05, 0]}>
        <SnackBarModel />
      </group>
      <ContactShadows
        position={[0, -0.72, 0]}
        opacity={0.52}
        scale={6}
        blur={2.5}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.35}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.65}
        target={[0, -0.05, 0]}
      />
    </Canvas>
  );
}
