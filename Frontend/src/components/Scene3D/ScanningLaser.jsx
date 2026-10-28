import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ScanningLaser({ scrollProgress, active, reducedMotion }) {
  const laserGroupRef = useRef();
  const ringRef = useRef();
  const beamRef = useRef();

  useFrame((state) => {
    if (!laserGroupRef.current) return;
    const group = laserGroupRef.current;
    const time = state.clock.getElapsedTime();

    // Laser is active during Stage C and D (progress 0.38 to 0.82)
    if (!active || scrollProgress < 0.36 || scrollProgress > 0.82) {
      group.visible = false;
      return;
    }

    group.visible = true;

    // Scan progress drives the vertical scan traversal
    const scanPhase = (scrollProgress - 0.36) / (0.82 - 0.36);
    const continuousOscillation = reducedMotion ? 0 : Math.sin(time * 3.5) * 0.45;
    const targetY = THREE.MathUtils.lerp(1.3, -1.3, scanPhase) + continuousOscillation;

    group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, 0.12);

    // Dynamic scanning ring pulse
    if (ringRef.current && !reducedMotion) {
      const pulseScale = 1.0 + Math.sin(time * 6.0) * 0.04;
      ringRef.current.scale.set(pulseScale, pulseScale, 1);
    }
  });

  return (
    <group ref={laserGroupRef} position={[0, 0, 0.4]}>
      {/* 1. Luminous Electric-Blue Scanning Torus Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.022, 16, 72]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
      </mesh>

      {/* 2. Soft Ambient Halo Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.065, 12, 48]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.3} />
      </mesh>

      {/* 3. Razor-Sharp Cyan Scanning Beam Line */}
      <mesh ref={beamRef}>
        <boxGeometry args={[5.2, 0.016, 0.016]} />
        <meshBasicMaterial color="#67e8f9" />
      </mesh>

      {/* 4. Volumetric Light Sheet (Vertical semi-transparent blade) */}
      <mesh position={[0, 0.09, 0]}>
        <planeGeometry args={[5.2, 0.24]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.10}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. Scanner Local Point Light Illuminating Document Glass */}
      <pointLight color="#38bdf8" intensity={2.4} distance={4.0} decay={2} />
    </group>
  );
}
