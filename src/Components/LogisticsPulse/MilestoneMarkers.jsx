import React from 'react';
import { Html } from '@react-three/drei';

const MILESTONES = [
  {
    id: 'm1',
    code: '01',
    label: 'PICKUP',
    position: [-2.6, 0.35, 1.6],
  },
  {
    id: 'm2',
    code: '02',
    label: 'IN TRANSIT',
    position: [3.2, 0.45, -0.4],
  },
  {
    id: 'm3',
    code: '03',
    label: 'DELIVERED',
    position: [-0.5, 0.65, -3.2],
  },
];

export function MilestoneMarkers() {
  return (
    <group>
      {MILESTONES.map((m) => (
        <group key={m.id} position={m.position}>
          {/* Thin, Subtle Connector Stem Line */}
          <mesh position={[0, -0.19, 0]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.38, 8]} />
            <meshBasicMaterial color="#397565" opacity={0.45} transparent />
          </mesh>

          {/* Glowing 3D Milestone Node Dot */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial
              color="#CAEB66"
              emissive="#CAEB66"
              emissiveIntensity={0.85}
            />
          </mesh>

          {/* Subtle Ground Ring at Milestone Node Base */}
          <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.07, 0.1, 32]} />
            <meshBasicMaterial color="#CAEB66" opacity={0.35} transparent />
          </mesh>

          {/* HTML Glassmorphic Micro-Badge (Slightly Reduced Size & Refined Hierarchy) */}
          <Html
            position={[0, 0.22, 0]}
            center
            distanceFactor={16}
            zIndexRange={[100, 0]}
          >
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#02312A]/90 backdrop-blur-md border border-[#CAEB66]/35 text-[#CAEB66] text-[10px] sm:text-[11px] font-mono tracking-wider font-medium shadow-lg pointer-events-none select-none whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CAEB66] animate-pulse shadow-[0_0_6px_#CAEB66]" />
              <span>
                <strong className="font-bold opacity-85">{m.code}</strong> • {m.label}
              </span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
