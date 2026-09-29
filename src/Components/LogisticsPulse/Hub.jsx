import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Hub({ hubData, isActive, onHover }) {
  const coreRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.8;
      coreRef.current.rotation.x += delta * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <group position={hubData.position}>
      {/* Base Circular Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.4, 32]} />
        <meshBasicMaterial
          color={isActive ? '#CAEB66' : '#475569'}
          side={THREE.DoubleSide}
          transparent
          opacity={isActive ? 0.9 : 0.4}
        />
      </mesh>

      {/* Outer Halo Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshBasicMaterial
          color={isActive ? '#CAEB66' : '#1E293B'}
          transparent
          opacity={isActive ? 0.2 : 0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Central Geometric Core */}
      <mesh ref={coreRef} position={[0, 0.6, 0]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={isActive ? '#CAEB66' : '#94A3B8'}
          emissive={isActive ? '#CAEB66' : '#1E293B'}
          emissiveIntensity={isActive ? 1.2 : 0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner Glowing Point Light */}
      <pointLight
        color={isActive ? '#CAEB66' : '#38BDF8'}
        intensity={isActive ? 2.5 : 0.5}
        distance={6}
      />

      {/* Floating HTML Badge */}
      <Html position={[0, 1.8, 0]} center distanceFactor={30}>
        <div
          onMouseEnter={() => onHover && onHover(hubData)}
          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider transition-all duration-300 pointer-events-auto whitespace-nowrap cursor-pointer ${
            isActive
              ? 'bg-[#CAEB66] text-slate-950 shadow-md shadow-[#CAEB66]/30 scale-110'
              : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-white'
          }`}
        >
          {hubData.code}
        </div>
      </Html>
    </group>
  );
}
