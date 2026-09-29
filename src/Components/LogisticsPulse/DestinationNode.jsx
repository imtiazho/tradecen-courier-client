import React, { useMemo } from 'react';
import * as THREE from 'three';

export function DestinationNode({ satellite, hubPosition }) {
  const linePoints = useMemo(() => {
    return [new THREE.Vector3(...hubPosition), new THREE.Vector3(...satellite.position)];
  }, [hubPosition, satellite.position]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(linePoints);
  }, [linePoints]);

  return (
    <group position={satellite.position}>
      {/* Subtle Satellite Node Dot */}
      <mesh castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#38BDF8"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Connecting Dotted Line back to Hub */}
      <line geometry={lineGeometry}>
        <lineDashedMaterial
          color="#38BDF8"
          dashSize={0.4}
          gapSize={0.3}
          transparent
          opacity={0.3}
        />
      </line>
    </group>
  );
}
