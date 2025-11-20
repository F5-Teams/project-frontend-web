"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface Model3DProps {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function Model3D({
  modelPath,
  scale = 1,
  position = [0, 0, 0],
  rotation = [-0.2, -0.2, 0],
}: Model3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load model with error handling
  const { scene, animations } = useGLTF(modelPath, true, true, (loader) => {
    loader.manager.onError = (url) => {
      console.error(`Error loading ${url}`);
    };
  });

  const { actions } = useAnimations(animations, groupRef);

  // Play all animations
  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        action?.play();
      });
    }
  }, [actions]);

  if (!scene) {
    console.warn("Scene not loaded yet");
    return null;
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive object={scene} scale={scale} />
    </group>
  );
}
