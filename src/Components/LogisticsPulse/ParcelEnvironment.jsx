import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

export function ParcelEnvironment() {
  const underlightRef = useRef();
  const prefersReducedMotionRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useFrame((state) => {
    if (prefersReducedMotionRef.current) return;
    const t = state.clock.getElapsedTime();

    if (underlightRef.current) {
      underlightRef.current.intensity = 1.15 + Math.sin(t * 1.4) * 0.18;
    }
  });

  return (
    <>
      {/* Deep Emerald Brand Background & Atmospheric Fog */}
      <color attach="background" args={['#02312A']} />
      <fog attach="fog" args={['#02312A', 18, 48]} />

      {/* Soft Ambient Fill Light */}
      <ambientLight intensity={0.45} color="#D2E8DD" />

      {/* Warm Front Studio Key Light */}
      <directionalLight
        position={[0, 7, 9]}
        intensity={1.1}
        color="#FFEEDD"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Secondary Soft Rim Light from Rear Left */}
      <directionalLight
        position={[-9, 6, -8]}
        intensity={0.55}
        color="#CAEB66"
      />

      {/* Cool Emerald Fill Light from Front Bottom */}
      <directionalLight
        position={[0, -4, 8]}
        intensity={0.35}
        color="#1E5245"
      />

      {/* Soft Lime Upward Underlight Beneath Central Parcel */}
      <pointLight
        ref={underlightRef}
        position={[0, 0.15, 0]}
        intensity={1.15}
        color="#CAEB66"
        distance={7}
        decay={2}
      />

      {/* Secondary Emerald Diffused Underlight */}
      <pointLight
        position={[0, 0.05, 0]}
        intensity={0.7}
        color="#103E33"
        distance={9}
        decay={2}
      />

      {/* Layer B — Premium Multi-Depth Floating Particles (UNCHANGED) */}
      {/* Field 1: Muted Emerald Atmosphere Particles */}
      <Sparkles
        count={isMobile ? 30 : 50}
        scale={[22, 12, 22]}
        position={[0, 1.8, -1.0]}
        size={isMobile ? 2.2 : 3.2}
        speed={0.15}
        opacity={0.55}
        color="#397565"
      />

      {/* Field 2: Soft Lime-Green Ambient Floating Sparkles */}
      <Sparkles
        count={isMobile ? 25 : 45}
        scale={[18, 10, 18]}
        position={[0, 2.0, -0.5]}
        size={isMobile ? 2.0 : 2.8}
        speed={0.22}
        opacity={0.65}
        color="#CAEB66"
      />

      {/* Field 3: Warm-White Shimmering Accent Sparkles */}
      <Sparkles
        count={isMobile ? 15 : 25}
        scale={[16, 9, 16]}
        position={[0, 2.2, -0.8]}
        size={isMobile ? 1.8 : 2.4}
        speed={0.18}
        opacity={0.7}
        color="#FFF8F0"
      />

      {/* Field 4: Distant Subtle Micro-Glimmers */}
      <Sparkles
        count={isMobile ? 15 : 30}
        scale={[26, 14, 26]}
        position={[0, 2.5, -3.0]}
        size={isMobile ? 1.6 : 2.2}
        speed={0.12}
        opacity={0.45}
        color="#88D6A4"
      />
    </>
  );
}
