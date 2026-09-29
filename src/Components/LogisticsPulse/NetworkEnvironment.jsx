import React from 'react';
import { Sparkles, Grid } from '@react-three/drei';

export function NetworkEnvironment() {
  return (
    <>
      <color attach="background" args={['#02312A']} />
      <fog attach="fog" args={['#070A0F', 30, 85]} />

      <ambientLight intensity={0.5} color="#94A3B8" />
      <directionalLight
        position={[20, 30, 20]}
        intensity={1.0}
        color="#FFFFFF"
      />
      <directionalLight
        position={[-20, -10, -20]}
        intensity={0.3}
        color="#38BDF8"
      />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#CAEB66" distance={50} />

      {/* Subtle Floating Ambient Particles */}
      <Sparkles
        count={80}
        scale={[60, 40, 60]}
        size={2.5}
        speed={0.4}
        opacity={0.3}
        color="#CAEB66"
      />

      {/* Subtle Spatial Grid Ground Plane */}
      <group position={[0, -10, 0]}>
        <Grid
          args={[120, 120]}
          cellSize={2}
          cellThickness={0.5}
          cellColor="#1E293B"
          sectionSize={10}
          sectionThickness={1.0}
          sectionColor="#334155"
          fadeDistance={60}
          fadeStrength={1.5}
        />
      </group>
    </>
  );
}
