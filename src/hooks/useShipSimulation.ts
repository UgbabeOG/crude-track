import { useState, useEffect } from 'react';

export interface Location {
  x: number;
  y: number;
  name: string;
}

export const PORTS: Location[] = [
  { x: 150, y: 250, name: 'port_a' },
  { x: 450, y: 150, name: 'port_b' },
  { x: 750, y: 350, name: 'port_c' },
];

export type VesselStatus = 'in_transit' | 'docked' | 'discharging';

export const useShipSimulation = () => {
  const [progress, setProgress] = useState(0); // 0 to 100 for the whole journey
  const [currentPortIndex, setCurrentPortIndex] = useState(0);
  const [status, setStatus] = useState<VesselStatus>('docked');
  const [position, setPosition] = useState({ x: PORTS[0].x, y: PORTS[0].y });

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0; // Reset for demo loop
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate position based on progress
    // Journey 1: P0 to P1 (0-50%)
    // Journey 2: P1 to P2 (50-100%)
    
    let start, end, localProgress;
    
    if (progress < 50) {
      start = PORTS[0];
      end = PORTS[1];
      localProgress = progress / 50;
      setCurrentPortIndex(0);
    } else {
      start = PORTS[1];
      end = PORTS[2];
      localProgress = (progress - 50) / 50;
      setCurrentPortIndex(1);
    }

    // Status logic
    if (localProgress < 0.1) {
      setStatus('docked');
    } else if (localProgress > 0.4 && localProgress < 0.6 && progress < 50) {
      // Small "docking" at the middle port if we want, 
      // but let's keep it simple: in_transit between stops.
      setStatus('in_transit');
    } else {
      setStatus('in_transit');
    }

    // Linear interpolation for position
    const newX = start.x + (end.x - start.x) * localProgress;
    const newY = start.y + (end.y - start.y) * localProgress;
    
    setPosition({ x: newX, y: newY });

  }, [progress]);

  return { position, progress, status, currentPortIndex };
};
