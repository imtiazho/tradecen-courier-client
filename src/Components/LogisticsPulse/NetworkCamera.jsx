import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export function NetworkCamera({ autoRotate = true }) {
  const controlsRef = useRef();
  const { camera } = useThree();
  const angleRef = useRef(0);
  const isUserInteractingRef = useRef(false);
  const userTimeoutRef = useRef(null);

  const handleStart = () => {
    isUserInteractingRef.current = true;
    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
  };

  const handleEnd = () => {
    // Resume auto rotation after 4 seconds of idle
    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    userTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 4000);
  };

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    if (autoRotate && !isUserInteractingRef.current) {
      // Extremely slow cinematic camera orbit
      angleRef.current += delta * 0.08;
      const radius = 35;
      const x = Math.sin(angleRef.current) * radius;
      const z = Math.cos(angleRef.current) * radius;
      const y = 14 + Math.sin(angleRef.current * 0.5) * 4;

      camera.position.lerp(new THREE.Vector3(x, y, z), delta * 1.5);
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), delta * 1.5);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={10}
      maxDistance={75}
      maxPolarAngle={Math.PI / 2 - 0.02}
      onStart={handleStart}
      onEnd={handleEnd}
      makeDefault
    />
  );
}
