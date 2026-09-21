import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE } from "@/lib/palette";
import { useCart } from "@/lib/cart-store";
import { SnackBarModel, preloadSnackBar } from "@/components/three/SnackBarModel";

preloadSnackBar();

const ACCENTS: Record<string, string> = {
  original: "#ffffff",
  dark: "#cbb3a4",
  caramel: "#ffe1c2",
  crunch: "#fff6ea",
};

export default function ViewerCanvas() {
  const flavor = useCart((s) => s.viewing) ?? "original";
  const mobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : true;

  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.3, 2.9], fov: 36 }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.18;
        gl.setClearColor(PALETTE.cocoa, 1);
        scene.background = new THREE.Color(PALETTE.cocoa);
      }}
    >
      <color attach="background" args={[PALETTE.cocoa]} />
      <ambientLight intensity={0.5} color={PALETTE.cream} />
      <spotLight
        position={[2.8, 3.8, 2.8]}
        angle={0.48}
        penumbra={0.9}
        intensity={52}
        color="#FFE4C4"
      />
      <pointLight position={[-2.2, 1.1, 1.8]} intensity={9} color="#FFF5E8" />
      <group rotation={[1.12, 0.5, 0.05]} scale={1.85} position={[0, -0.04, 0]}>
        <SnackBarModel accent={ACCENTS[flavor] ?? ACCENTS.original} />
      </group>
      <ContactShadows
        position={[0, -0.68, 0]}
        opacity={0.5}
        scale={5.5}
        blur={2.4}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.8}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.7}
        target={[0, -0.04, 0]}
      />
    </Canvas>
  );
}
