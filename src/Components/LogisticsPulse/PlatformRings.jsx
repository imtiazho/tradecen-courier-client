import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

export function PlatformRings() {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const underlightGlowRef = useRef();
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useFrame((state) => {
    if (prefersReducedMotionRef.current) return;
    const t = state.clock.getElapsedTime();

    if (ring1Ref.current) {
      ring1Ref.current.material.opacity = 0.45 + Math.sin(t * 1.2) * 0.18;
    }
    if (ring2Ref.current) {
      ring2Ref.current.material.opacity = 0.38 + Math.sin(t * 1.2 + 1.2) * 0.16;
    }
    if (ring3Ref.current) {
      ring3Ref.current.material.opacity = 0.32 + Math.sin(t * 1.2 + 2.4) * 0.14;
    }
    if (underlightGlowRef.current) {
      underlightGlowRef.current.material.opacity = 0.18 + Math.sin(t * 1.5) * 0.06;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Reduced Visual Weight: Semi-Transparent Outer Ground Disc Platform */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.2, 64]} />
        <meshStandardMaterial
          color="#042620"
          roughness={0.92}
          metalness={0.04}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Reduced Visual Weight: Inner Accent Ground Disc */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.2, 64]} />
        <meshStandardMaterial
          color="#09332A"
          roughness={0.8}
          metalness={0.04}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Diffused Lime-Green Light Pool Core Beneath Parcel */}
      <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.1, 48]} />
        <meshBasicMaterial color="#CAEB66" opacity={0.24} transparent />
      </mesh>

      {/* Soft Outer Lime-Green Light Pool Disc */}
      <mesh ref={underlightGlowRef} position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.1, 64]} />
        <meshBasicMaterial color="#CAEB66" opacity={0.18} transparent />
      </mesh>

      {/* Natural Ground Contact Shadow Disc directly underneath parcel */}
      <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.75, 32]} />
        <meshBasicMaterial color="#011410" opacity={0.65} transparent />
      </mesh>

      {/* Concentric Ring 1 - Inner Tracking Ring (Thinner, Refined) */}
      <mesh ref={ring1Ref} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.0065, 16, 96]} />
        <meshStandardMaterial
          color="#CAEB66"
          emissive="#CAEB66"
          emissiveIntensity={0.45}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Concentric Ring 2 - Mid Tracking Ring (Thinner, Refined) */}
      <mesh ref={ring2Ref} position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.1, 0.006, 16, 96]} />
        <meshStandardMaterial
          color="#CAEB66"
          emissive="#CAEB66"
          emissiveIntensity={0.35}
          transparent
          opacity={0.38}
        />
      </mesh>

      {/* Concentric Ring 3 - Outer Tracking Ring (Thinner, Comfortably Inside Boundaries) */}
      <mesh ref={ring3Ref} position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.95, 0.005, 16, 96]} />
        <meshStandardMaterial
          color="#397565"
          emissive="#CAEB66"
          emissiveIntensity={0.22}
          transparent
          opacity={0.32}
        />
      </mesh>

      {/* Restrained Lime-Green Glowing Tracking Points on Platform Rings */}
      {/* Node A (Inner Ring) */}
      <group position={[1.55, 0.06, 1.55]}>
        <mesh>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#CAEB66" emissive="#CAEB66" emissiveIntensity={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.045, 0.075, 24]} />
          <meshBasicMaterial color="#CAEB66" opacity={0.4} transparent />
        </mesh>
      </group>

      {/* Node B (Mid Ring) */}
      <group position={[-2.91, 0.14, 1.06]}>
        <mesh>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#CAEB66" emissive="#CAEB66" emissiveIntensity={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.045, 0.075, 24]} />
          <meshBasicMaterial color="#CAEB66" opacity={0.4} transparent />
        </mesh>
      </group>

      {/* Node C (Mid Ring) */}
      <group position={[2.19, 0.14, -2.19]}>
        <mesh>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#CAEB66" emissive="#CAEB66" emissiveIntensity={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.045, 0.075, 24]} />
          <meshBasicMaterial color="#CAEB66" opacity={0.4} transparent />
        </mesh>
      </group>

      {/* Node D (Outer Ring) */}
      <group position={[-1.35, 0.22, -3.71]}>
        <mesh>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#CAEB66" emissive="#CAEB66" emissiveIntensity={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.045, 0.075, 24]} />
          <meshBasicMaterial color="#CAEB66" opacity={0.35} transparent />
        </mesh>
      </group>
    </group>
  );
}
