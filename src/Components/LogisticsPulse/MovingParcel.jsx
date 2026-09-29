import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function MovingParcel({
  parcelId,
  initialHubId,
  hubsMap,
  adjacencyMap,
  onArrival,
  onRouteActive,
  isPaused
}) {
  const meshRef = useRef();

  // State inside ref to avoid React re-renders on every frame
  const stateRef = useRef({
    currentHubId: initialHubId,
    targetHubId: null,
    progress: 0,
    speed: 0.15 + Math.random() * 0.1, // Randomized speed per parcel
    isWaiting: false,
    waitTime: 0,
    curve: null
  });

  // Pick next random connected hub
  const pickNextTarget = (fromId) => {
    const neighbors = adjacencyMap[fromId] || [];
    if (neighbors.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * neighbors.length);
    return neighbors[randomIndex];
  };

  // Setup initial route curve if not present
  if (!stateRef.current.targetHubId) {
    const nextId = pickNextTarget(initialHubId);
    if (nextId) {
      stateRef.current.targetHubId = nextId;
      const start = new THREE.Vector3(...hubsMap[initialHubId].position);
      const end = new THREE.Vector3(...hubsMap[nextId].position);
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      mid.y += Math.min(3.5, start.distanceTo(end) * 0.2);
      stateRef.current.curve = new THREE.CatmullRomCurve3([start, mid, end]);

      if (onRouteActive) {
        onRouteActive(initialHubId, nextId);
      }
    }
  }

  useFrame((state, delta) => {
    if (!meshRef.current || isPaused) return;
    const s = stateRef.current;

    if (s.isWaiting) {
      s.waitTime += delta;
      if (s.waitTime >= 0.5) { // Wait 0.5s inside hub before departing
        s.isWaiting = false;
        s.waitTime = 0;
        s.progress = 0;

        // Pick next destination
        const nextId = pickNextTarget(s.currentHubId);
        if (nextId) {
          s.targetHubId = nextId;
          const start = new THREE.Vector3(...hubsMap[s.currentHubId].position);
          const end = new THREE.Vector3(...hubsMap[nextId].position);
          const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
          mid.y += Math.min(3.5, start.distanceTo(end) * 0.2);
          s.curve = new THREE.CatmullRomCurve3([start, mid, end]);

          if (onRouteActive) {
            onRouteActive(s.currentHubId, nextId);
          }
        }
      }
      return;
    }

    if (s.curve) {
      s.progress += delta * s.speed;

      if (s.progress >= 1.0) {
        // Arrived at destination hub!
        s.progress = 1.0;
        s.currentHubId = s.targetHubId;
        s.isWaiting = true;

        if (onArrival) {
          onArrival(s.currentHubId, hubsMap[s.currentHubId].position);
        }
      } else {
        // Move along curve
        const pt = s.curve.getPointAt(s.progress);
        const tan = s.curve.getTangentAt(s.progress);
        meshRef.current.position.copy(pt);

        if (tan.lengthSq() > 0.001) {
          meshRef.current.lookAt(pt.clone().add(tan));
        }
      }
    }
  });

  return (
    <group ref={meshRef}>
      {/* Moving Parcel Mesh */}
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.28, 0.45]} />
        <meshStandardMaterial
          color="#CAEB66"
          emissive="#CAEB66"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Parcel Tape Highlight */}
      <mesh position={[0, 0.15, 0]}>
        <planeGeometry args={[0.1, 0.46]} />
        <meshBasicMaterial color="#FFFFFF" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
