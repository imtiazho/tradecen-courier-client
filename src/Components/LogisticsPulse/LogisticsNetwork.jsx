import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ParcelEnvironment } from './ParcelEnvironment';
import { CentralParcel } from './CentralParcel';
import { PlatformRings } from './PlatformRings';
import { MilestoneMarkers } from './MilestoneMarkers';

function ResponsiveFixedCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const isMobile = size.width < 768;
    camera.fov = isMobile ? 42 : 35;
    camera.position.set(7.0, 5.3, 8.2);
    camera.lookAt(0, 0.5, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

export function LogisticsNetwork() {
  return (
    <Canvas
      shadows
      camera={{ position: [7.0, 5.3, 8.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="w-full h-full select-none"
    >
      <ResponsiveFixedCamera />
      <ParcelEnvironment />
      <PlatformRings />
      <CentralParcel />
    </Canvas>
  );
}
