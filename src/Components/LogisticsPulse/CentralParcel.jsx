import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

export function CentralParcel() {
  const groupRef = useRef();
  const isDraggingRef = useRef(false);
  const isAutoRotatingRef = useRef(true);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const resumeTimeoutRef = useRef(null);
  const prefersReducedMotionRef = useRef(false);

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;
    if (mediaQuery.matches) {
      isAutoRotatingRef.current = false;
    }

    const handleChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
      if (e.matches) {
        isAutoRotatingRef.current = false;
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'grabbing';
    } else if (isHovered) {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'default';
    }
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isHovered, isDragging]);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (_) {}

    isDraggingRef.current = true;
    setIsDragging(true);
    isAutoRotatingRef.current = false;

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !groupRef.current) return;
    e.stopPropagation();

    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.007;
    const rotYDelta = deltaX * sensitivity;
    const rotXDelta = deltaY * sensitivity;

    // Apply horizontal rotation (Y-axis)
    groupRef.current.rotation.y += rotYDelta;

    // Apply vertical tilt (X-axis) with safe clamp
    const nextRotX = groupRef.current.rotation.x + rotXDelta;
    groupRef.current.rotation.x = Math.max(-0.45, Math.min(0.45, nextRotX));

    velocityRef.current = { x: rotXDelta, y: rotYDelta };
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();
    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (_) {}

    isDraggingRef.current = false;
    setIsDragging(false);

    if (!prefersReducedMotionRef.current) {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        isAutoRotatingRef.current = true;
      }, 2000);
    }
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!isDraggingRef.current) {
      // Inertia post-drag
      if (Math.abs(velocityRef.current.y) > 0.0001) {
        groupRef.current.rotation.y += velocityRef.current.y;
        velocityRef.current.y *= 0.92;
      }
      if (Math.abs(velocityRef.current.x) > 0.0001) {
        const nextRotX = groupRef.current.rotation.x + velocityRef.current.x;
        groupRef.current.rotation.x = Math.max(-0.45, Math.min(0.45, nextRotX));
        velocityRef.current.x *= 0.92;
      }

      // Return vertical tilt gently to level X=0 when idle
      if (Math.abs(velocityRef.current.x) <= 0.0001) {
        groupRef.current.rotation.x *= 0.96;
      }

      // Continuous slow auto-rotation around vertical Y-axis
      if (isAutoRotatingRef.current) {
        groupRef.current.rotation.y += delta * 0.38;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Invisible Expanded Hit Sphere for Smooth Dragging */}
      <mesh visible={false}>
        <sphereGeometry args={[2.8, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Main Cardboard Box Body */}
      <mesh position={[0, 1.025, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.85, 2.05, 2.85]} />
        <meshStandardMaterial
          color="#A06E3B"
          roughness={0.82}
          metalness={0.01}
        />
      </mesh>

      {/* Subdued Inner Cardboard Flap / Seam Details */}
      <mesh position={[0, 2.051, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.83, 0.025]} />
        <meshBasicMaterial color="#644120" opacity={0.6} transparent />
      </mesh>
      <mesh position={[0, 2.052, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[2.83, 0.025]} />
        <meshBasicMaterial color="#644120" opacity={0.35} transparent />
      </mesh>

      {/* Primary Emerald Packaging Tape (Z-Axis Wrap) */}
      <mesh position={[0, 1.025, 0]} castShadow>
        <boxGeometry args={[0.54, 2.06, 2.86]} />
        <meshStandardMaterial
          color="#103E33"
          roughness={0.28}
          metalness={0.14}
        />
      </mesh>

      {/* Secondary Top Tape Seam (X-Axis Top Seal) */}
      <mesh position={[0, 2.058, 0]}>
        <boxGeometry args={[2.86, 0.02, 0.48]} />
        <meshStandardMaterial
          color="#103E33"
          roughness={0.28}
          metalness={0.14}
        />
      </mesh>

      {/* Refined Abstract Shipping Label */}
      <group position={[0.55, 2.062, 0.35]} rotation={[-Math.PI / 2, 0, 0.08]}>
        {/* Label White Base Plane */}
        <mesh receiveShadow>
          <planeGeometry args={[0.85, 1.1]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.48} />
        </mesh>

        {/* Abstract Brand Accent Emblem */}
        <mesh position={[-0.26, 0.38, 0.001]}>
          <planeGeometry args={[0.16, 0.16]} />
          <meshBasicMaterial color="#CAEB66" />
        </mesh>

        {/* Abstract Header Line */}
        <mesh position={[0.1, 0.38, 0.001]}>
          <planeGeometry args={[0.42, 0.04]} />
          <meshBasicMaterial color="#02312A" />
        </mesh>

        {/* Abstract Barcode Lines */}
        <mesh position={[0, 0.1, 0.001]}>
          <planeGeometry args={[0.68, 0.28]} />
          <meshBasicMaterial color="#1A2E28" />
        </mesh>

        {/* Abstract QR Matrix Code Box */}
        <mesh position={[-0.2, -0.28, 0.001]}>
          <planeGeometry args={[0.26, 0.26]} />
          <meshBasicMaterial color="#02312A" />
        </mesh>

        {/* Abstract Text Bar Lines */}
        <mesh position={[0.16, -0.22, 0.001]}>
          <planeGeometry args={[0.34, 0.04]} />
          <meshBasicMaterial color="#397565" />
        </mesh>
        <mesh position={[0.16, -0.32, 0.001]}>
          <planeGeometry args={[0.34, 0.04]} />
          <meshBasicMaterial color="#397565" />
        </mesh>
      </group>
    </group>
  );
}
