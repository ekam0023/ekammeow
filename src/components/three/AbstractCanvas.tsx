import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE } from "@/lib/palette";
import { useScene } from "@/lib/scene-store";

interface ShapeConfig {
  kind: "sphere" | "box" | "torus" | "capsule"
  color: string
  position: [number, number, number]
  scale: number
  speed: number
  parallax: number
}

const SHAPES: ShapeConfig[] = [
  { kind: "sphere", color: PALETTE.chocolate, position: [-2.2, 0.4, -1], scale: 0.85, speed: 0.18, parallax: 1.2 },
  { kind: "sphere", color: PALETTE.blush, position: [2.4, 1.1, -0.6], scale: 0.55, speed: 0.26, parallax: 1.6 },
  { kind: "sphere", color: PALETTE.aqua, position: [0.2, -1.2, 0.4], scale: 0.38, speed: 0.32, parallax: 2.1 },
  { kind: "sphere", color: PALETTE.iris, position: [-1.6, -0.9, 0.8], scale: 0.32, speed: 0.22, parallax: 1.4 },
  { kind: "box", color: PALETTE.caramel, position: [1.6, -0.2, -1.4], scale: 0.7, speed: 0.14, parallax: 0.9 },
  { kind: "box", color: PALETTE.cream, position: [-2.8, 1.3, -2], scale: 0.42, speed: 0.2, parallax: 1.8 },
  { kind: "torus", color: PALETTE.cobalt, position: [0.6, 1.4, -1.8], scale: 0.9, speed: 0.12, parallax: 1.1 },
  { kind: "torus", color: PALETTE.caramel, position: [-0.8, 0.2, 1.1], scale: 0.55, speed: 0.28, parallax: 2.4 },
  { kind: "capsule", color: PALETTE.milk, position: [2.8, -1.1, -0.2], scale: 0.5, speed: 0.16, parallax: 1.3 },
  { kind: "sphere", color: PALETTE.darkChocolate, position: [0.1, 0.6, -2.6], scale: 1.1, speed: 0.1, parallax: 0.6 },
];

function Shape({ config, index }: { config: ShapeConfig; index: number }) {
  const ref = useRef<THREE.Group>(null);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(config.color),
        roughness: 0.18,
        metalness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
      }),
    [config.color],
  );

  useFrame((state) => {
    const group = ref.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    const p = useScene.getState().abstract;
    const mouseX = state.pointer.x * 0.35 * config.parallax;
    const mouseY = state.pointer.y * 0.25 * config.parallax;
    group.position.x = config.position[0] + Math.sin(t * config.speed + index) * 0.25 + mouseX - p * config.parallax * 0.8;
    group.position.y = config.position[1] + Math.cos(t * config.speed * 0.8 + index) * 0.2 + mouseY + p * 0.4 * (index % 2 === 0 ? 1 : -1);
    group.position.z = config.position[2] + p * (index % 3 === 0 ? -1.6 : 0.9);
    group.rotation.x = t * config.speed * 0.6;
    group.rotation.y = t * config.speed * 0.4 + p;
  });

  return (
    <group ref={ref} position={config.position} scale={config.scale}>
      {config.kind === "sphere" ? (
        <mesh castShadow>
          <sphereGeometry args={[0.7, 32, 32]} />
          <primitive object={material} attach="material" />
        </mesh>
      ) : null}
      {config.kind === "box" ? (
        <RoundedBox args={[1, 1, 1]} radius={0.12} smoothness={4} castShadow>
          <primitive object={material} attach="material" />
        </RoundedBox>
      ) : null}
      {config.kind === "torus" ? (
        <mesh rotation={[Math.PI / 2.4, 0.3, 0]} castShadow>
          <torusGeometry args={[0.55, 0.16, 24, 64]} />
          <primitive object={material} attach="material" />
        </mesh>
      ) : null}
      {config.kind === "capsule" ? (
        <mesh rotation={[0, 0, Math.PI / 5]} castShadow>
          <capsuleGeometry args={[0.28, 0.9, 8, 16]} />
          <primitive object={material} attach="material" />
        </mesh>
      ) : null}
    </group>
  );
}

function Scene() {
  const mobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : true;
  const shapes = mobile ? SHAPES.slice(0, 6) : SHAPES;

  return (
    <>
      <color attach="background" args={[PALETTE.cocoaDeep]} />
      <fog attach="fog" args={[PALETTE.cocoaDeep, 6, 16]} />
      <ambientLight intensity={0.35} />
      <spotLight position={[5, 6, 4]} intensity={50} angle={0.45} penumbra={0.9} color="#FFE0C0" />
      <pointLight position={[-4, -2, 3]} intensity={14} color={PALETTE.iris} />
      <pointLight position={[3, 2, -2]} intensity={10} color={PALETTE.aqua} />
      {shapes.map((shape, i) => (
        <Shape key={i} config={shape} index={i} />
      ))}
    </>
  );
}

export default function AbstractCanvas() {
  const mobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : true;

  return (
    <Canvas
      dpr={mobile ? [1, 1.2] : [1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7.2], fov: 40 }}
      style={{ pointerEvents: "none" }}
    >
      <Scene />
    </Canvas>
  );
}
