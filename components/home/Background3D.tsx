"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Model3D } from "@/components/chat/Model3D";
import { Model3DErrorBoundary } from "@/components/chat/Model3DErrorBoundary";
import * as THREE from "three";

function InteractiveModel3D() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  // Track mouse position
  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  // Smooth rotation using lerp
  useFrame(() => {
    if (groupRef.current) {
      // Calculate target rotation
      targetRotation.current.y = mouseRef.current.x * 0.15;
      targetRotation.current.x = mouseRef.current.y * 0.15;

      // Smooth interpolation (lerp) for fluid motion
      groupRef.current.rotation.y +=
        (targetRotation.current.y - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x +=
        (targetRotation.current.x - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.z = 0;
    }
  });

  return (
    <group ref={groupRef}>
      <Model3D
        modelPath="/models/Dogsong/scene.gltf"
        scale={1.3}
        position={[0, -0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

export function Background3D() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        style={{
          background:
            "linear-gradient(180deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#e0f2fe");
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 1, 6]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <directionalLight position={[-5, 5, -5]} intensity={1} />
        <directionalLight position={[0, -5, 5]} intensity={0.8} />
        <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
        <pointLight position={[3, 3, 3]} intensity={0.8} color="#ffffffff" />
        <spotLight
          position={[0, 10, 5]}
          angle={0.4}
          penumbra={1}
          intensity={1.5}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <Model3DErrorBoundary>
            <InteractiveModel3D />
          </Model3DErrorBoundary>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          enabled={false}
        />
      </Canvas>
    </div>
  );
}
