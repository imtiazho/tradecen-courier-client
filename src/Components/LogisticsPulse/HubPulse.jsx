import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function HubPulse({ position, color = '#CAEB66', onComplete }) {
  const meshRef = useRef();
  const scaleRef = useRef(0.2);
  const opacityRef = useRef(0.9);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    scaleRef.current += delta * 4.5;
    opacityRef.current -= delta * 0.9;

    meshRef.current.scale.setScalar(scaleRef.current);

    if (meshRef.current.material) {
      meshRef.current.material.opacity = Math.max(0, opacityRef.current);
    }

    if (opacityRef.current <= 0 && onComplete) {
      onComplete();
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1.1, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
