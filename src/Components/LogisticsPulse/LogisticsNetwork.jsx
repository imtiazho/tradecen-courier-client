import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { NetworkEnvironment } from './NetworkEnvironment';
import { Hub } from './Hub';
import { Route } from './Route';
import { MovingParcel } from './MovingParcel';
import { HubPulse } from './HubPulse';
import { DestinationNode } from './DestinationNode';
import { NetworkCamera } from './NetworkCamera';
import { PULSE_HUBS, INITIAL_EDGES } from '../../data/logisticsPulseData';

export function LogisticsNetwork({ autoRotate, isPaused }) {
  const [activeHubId, setActiveHubId] = useState(null);
  const [activeEdgeId, setActiveEdgeId] = useState(null);
  const [pulses, setPulses] = useState([]);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [newEdgeId, setNewEdgeId] = useState(null);
  const [newEdgeProgress, setNewEdgeProgress] = useState(1.0);

  // Lookup maps for hubs and adjacency
  const hubsMap = useMemo(() => {
    const map = {};
    PULSE_HUBS.forEach(h => { map[h.id] = h; });
    return map;
  }, []);

  const adjacencyMap = useMemo(() => {
    const map = {};
    PULSE_HUBS.forEach(h => { map[h.id] = []; });
    edges.forEach(e => {
      if (map[e.from] && map[e.to]) {
        map[e.from].push(e.to);
        map[e.to].push(e.from);
      }
    });
    return map;
  }, [edges]);

  // Handle parcel arrival -> spawn pulse & highlight hub
  const handleArrival = useCallback((hubId, position) => {
    setActiveHubId(hubId);
    const newPulse = {
      id: `${hubId}-${Date.now()}-${Math.random()}`,
      position: [...position]
    };
    setPulses(prev => [...prev.slice(-12), newPulse]); // keep max 12 pulses
  }, []);

  const handleRemovePulse = useCallback((id) => {
    setPulses(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleRouteActive = useCallback((fromId, toId) => {
    const edge = edges.find(
      e => (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
    );
    if (edge) {
      setActiveEdgeId(edge.id);
    }
  }, [edges]);

  // Dynamic connection growth effect: occasionally introduce a new connection line!
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) return;
      // Pick two hubs that are not directly connected yet
      const h1 = PULSE_HUBS[Math.floor(Math.random() * PULSE_HUBS.length)];
      const h2 = PULSE_HUBS[Math.floor(Math.random() * PULSE_HUBS.length)];
      if (h1.id !== h2.id && !adjacencyMap[h1.id]?.includes(h2.id)) {
        const edgeId = `dyn-${h1.id}-${h2.id}-${Date.now()}`;
        setEdges(prev => [...prev, { id: edgeId, from: h1.id, to: h2.id }]);
        setNewEdgeId(edgeId);
        setNewEdgeProgress(0);

        // Animate growth progress
        let p = 0;
        const growTimer = setInterval(() => {
          p += 0.1;
          if (p >= 1.0) {
            setNewEdgeProgress(1.0);
            clearInterval(growTimer);
          } else {
            setNewEdgeProgress(p);
          }
        }, 50);
      }
    }, 14000); // Trigger every 14s

    return () => clearInterval(interval);
  }, [adjacencyMap, isPaused]);

  // Parcel starting assignments (10 continuous parcels)
  const initialParcelConfigs = useMemo(() => {
    return [
      { id: 'p1', startHub: 'hub-1' },
      { id: 'p2', startHub: 'hub-2' },
      { id: 'p3', startHub: 'hub-3' },
      { id: 'p4', startHub: 'hub-4' },
      { id: 'p5', startHub: 'hub-5' },
      { id: 'p6', startHub: 'hub-6' },
      { id: 'p7', startHub: 'hub-7' },
      { id: 'p8', startHub: 'hub-8' },
      { id: 'p9', startHub: 'hub-1' },
      { id: 'p10', startHub: 'hub-4' }
    ];
  }, []);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 24, 38], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="w-full h-full"
    >
      <NetworkEnvironment />
      <NetworkCamera autoRotate={autoRotate} />

      {/* Render Network Hubs */}
      {PULSE_HUBS.map(hub => (
        <Hub
          key={hub.id}
          hubData={hub}
          isActive={activeHubId === hub.id}
          onHover={h => setActiveHubId(h.id)}
        />
      ))}

      {/* Render Satellite Destination Nodes */}
      {PULSE_HUBS.flatMap(hub =>
        (hub.satellites || []).map(sat => (
          <DestinationNode
            key={sat.id}
            satellite={sat}
            hubPosition={hub.position}
          />
        ))
      )}

      {/* Render Connection Routes */}
      {edges.map(edge => {
        const fromHub = hubsMap[edge.from];
        const toHub = hubsMap[edge.to];
        if (!fromHub || !toHub) return null;
        const isActive = activeEdgeId === edge.id;
        const isNew = newEdgeId === edge.id;

        return (
          <Route
            key={edge.id}
            fromPos={fromHub.position}
            toPos={toHub.position}
            isActive={isActive}
            isNewConnection={isNew}
            growProgress={isNew ? newEdgeProgress : 1.0}
          />
        );
      })}

      {/* Render Expanding Arrival Pulses */}
      {pulses.map(pulse => (
        <HubPulse
          key={pulse.id}
          position={pulse.position}
          onComplete={() => handleRemovePulse(pulse.id)}
        />
      ))}

      {/* Render Continuous Moving Parcels */}
      {initialParcelConfigs.map(pConfig => (
        <MovingParcel
          key={pConfig.id}
          parcelId={pConfig.id}
          initialHubId={pConfig.startHub}
          hubsMap={hubsMap}
          adjacencyMap={adjacencyMap}
          onArrival={handleArrival}
          onRouteActive={handleRouteActive}
          isPaused={isPaused}
        />
      ))}
    </Canvas>
  );
}
