"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Model3D } from "./Model3D";
import { Model3DErrorBoundary } from "./Model3DErrorBoundary";

export function ChatButton3D() {
  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <spotLight
          position={[0, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
        />

        <Suspense fallback={null}>
          <Model3DErrorBoundary>
            <Model3D
              modelPath="/models/Dogsong/scene.gltf"
              scale={1.5}
              position={[0, 0, 0]}
            />
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
