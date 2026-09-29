// 3D Network Topology Data for The Logistics Pulse

export const PULSE_HUBS = [
  {
    id: 'hub-1',
    name: 'Central Matrix Hub',
    code: 'HUB-ALPHA',
    position: [-2, 1, 0],
    color: '#CAEB66',
    satellites: [
      { id: 'sat-1a', position: [-4, 1.8, 1.5], type: 'Business' },
      { id: 'sat-1b', position: [-0.5, 2.2, -2.5], type: 'Residence' }
    ]
  },
  {
    id: 'hub-2',
    name: 'North Gateway Hub',
    code: 'HUB-NORTH',
    position: [12, 3.5, -8],
    color: '#CAEB66',
    satellites: [
      { id: 'sat-2a', position: [14, 4.2, -6.5], type: 'Terminal' }
    ]
  },
  {
    id: 'hub-3',
    name: 'West Sorting Hub',
    code: 'HUB-WEST',
    position: [-14, 2.5, -10],
    color: '#38BDF8',
    satellites: [
      { id: 'sat-3a', position: [-16.5, 3.2, -12], type: 'Warehouse' }
    ]
  },
  {
    id: 'hub-4',
    name: 'East Express Hub',
    code: 'HUB-EAST',
    position: [18, -0.5, 4],
    color: '#CAEB66',
    satellites: [
      { id: 'sat-4a', position: [20, 0.2, 6], type: 'Commercial' },
      { id: 'sat-4b', position: [16.5, -1.2, 2], type: 'Residence' }
    ]
  },
  {
    id: 'hub-5',
    name: 'South Coastal Hub',
    code: 'HUB-SOUTH',
    position: [10, -2.8, 12],
    color: '#F43F5E',
    satellites: [
      { id: 'sat-5a', position: [12, -2.0, 14], type: 'Port Facility' }
    ]
  },
  {
    id: 'hub-6',
    name: 'Metro Dispatch Hub',
    code: 'HUB-METRO',
    position: [-10, -2.0, 10],
    color: '#CAEB66',
    satellites: [
      { id: 'sat-6a', position: [-12.5, -1.2, 11.5], type: 'Urban Depot' }
    ]
  },
  {
    id: 'hub-7',
    name: 'Pacific Freight Hub',
    code: 'HUB-PACIFIC',
    position: [-18, 0.5, -2],
    color: '#38BDF8',
    satellites: [
      { id: 'sat-7a', position: [-20, 1.2, 0], type: 'Cargo Bay' }
    ]
  },
  {
    id: 'hub-8',
    name: 'Apex Air Cargo Hub',
    code: 'HUB-AIR',
    position: [0, -3.5, 6],
    color: '#F59E0B',
    satellites: [
      { id: 'sat-8a', position: [2, -2.8, 8], type: 'Airport Terminal' }
    ]
  }
];

export const INITIAL_EDGES = [
  { id: 'e-1-2', from: 'hub-1', to: 'hub-2' },
  { id: 'e-1-3', from: 'hub-1', to: 'hub-3' },
  { id: 'e-1-8', from: 'hub-1', to: 'hub-8' },
  { id: 'e-2-4', from: 'hub-2', to: 'hub-4' },
  { id: 'e-3-7', from: 'hub-3', to: 'hub-7' },
  { id: 'e-7-6', from: 'hub-7', to: 'hub-6' },
  { id: 'e-8-5', from: 'hub-8', to: 'hub-5' },
  { id: 'e-8-6', from: 'hub-8', to: 'hub-6' },
  { id: 'e-4-5', from: 'hub-4', to: 'hub-5' },
  { id: 'e-2-3', from: 'hub-2', to: 'hub-3' },
  { id: 'e-6-5', from: 'hub-6', to: 'hub-5' },
  { id: 'e-1-7', from: 'hub-1', to: 'hub-7' }
];

export const PHILOSOPHY_WORDS = [
  { word: 'CONNECT', caption: 'Hubs linked in seamless synchronization' },
  { word: 'MOVE', caption: 'Continuous velocity across logistics arterial routes' },
  { word: 'ROUTE', caption: 'Dynamic pathing optimized in real-time' },
  { word: 'DELIVER', caption: 'Finalizing every physical node handover' }
];
