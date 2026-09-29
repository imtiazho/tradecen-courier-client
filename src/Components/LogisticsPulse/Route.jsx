import React, { useMemo } from 'react';
import * as THREE from 'three';

export function Route({ fromPos, toPos, isActive, isNewConnection = false, growProgress = 1.0 }) {
  // Create arc curve elevated slightly in 3D space
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...fromPos);
    const end = new THREE.Vector3(...toPos);

    // Calculate arc midpoint
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    mid.y += Math.min(3.5, dist * 0.2); // Soft vertical arch curve

    return new THREE.CatmullRomCurve3([start, mid, end]);
  }, [fromPos, toPos]);

  const tubeGeometry = useMemo(() => {
    // If growing connection, slice curve
    const sampleT = Math.max(0.05, growProgress);
    const subPoints = curve.getPoints(Math.floor(60 * sampleT));
    const subCurve = new THREE.CatmullRomCurve3(subPoints);
    return new THREE.TubeGeometry(subCurve, Math.max(8, Math.floor(60 * sampleT)), 0.05, 6, false);
  }, [curve, growProgress]);

  return (
    <mesh geometry={tubeGeometry}>
      <meshStandardMaterial
        color={isActive ? '#CAEB66' : isNewConnection ? '#38BDF8' : '#334155'}
        emissive={isActive ? '#CAEB66' : isNewConnection ? '#38BDF8' : '#0F172A'}
        emissiveIntensity={isActive ? 1.5 : isNewConnection ? 0.8 : 0.1}
        transparent
        opacity={isActive ? 0.95 : 0.4}
        roughness={0.3}
      />
    </mesh>
  );
}
