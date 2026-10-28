import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CircuitConnections({ scrollProgress, reducedMotion }) {
  const lineGroupRef = useRef();

  // Create curved 3D connection splines linking cross-verified parameters across sheets
  const splines = useMemo(() => {
    // Spline 1: Land Title (Sheet 0) -> Fire NOC (Sheet 1) [GIS Coordinates -> Campus Site Plan]
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.3, 0.35, 0.4),
      new THREE.Vector3(-1.0, 0.0, 0.65),
      new THREE.Vector3(-0.6, -0.3, 0.8),
    ]);

    // Spline 2: Fire NOC (Sheet 1) -> Bank Joint Escrow (Sheet 3) [Infrastructure Safety -> Corpus Guarantee]
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, -0.45, 0.75),
      new THREE.Vector3(0.5, -0.55, 0.55),
      new THREE.Vector3(1.4, -0.35, 0.3),
    ]);

    // Spline 3: Land Title (Sheet 0) -> Faculty Cadre (Sheet 2) [Campus Built-up Area -> Student Intake Capacity]
    const curve3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.1, 0.65, 0.4),
      new THREE.Vector3(0.0, 0.75, 0.7),
      new THREE.Vector3(0.6, 0.55, 0.9),
    ]);

    return [
      { curve: curve1, points: curve1.getPoints(50) },
      { curve: curve2, points: curve2.getPoints(50) },
      { curve: curve3, points: curve3.getPoints(50) },
    ];
  }, []);

  useFrame((state) => {
    if (!lineGroupRef.current) return;
    const group = lineGroupRef.current;

    // Splines become visible during Stages C and D (progress 0.40 to 0.84)
    if (scrollProgress < 0.40 || scrollProgress > 0.84) {
      group.visible = false;
      return;
    }

    group.visible = true;

    // Calculate smooth fade in/out
    const fadeIn = Math.min(1, (scrollProgress - 0.40) / 0.1);
    const fadeOut = Math.min(1, (0.84 - scrollProgress) / 0.08);
    const alpha = Math.min(fadeIn, fadeOut) * 0.75;

    group.children.forEach((child) => {
      if (child.material) {
        child.material.opacity = alpha;
      }
    });
  });

  return (
    <group ref={lineGroupRef} visible={false}>
      {splines.map((item, idx) => {
        const lineGeo = new THREE.BufferGeometry().setFromPoints(item.points);
        return (
          <group key={idx}>
            {/* Luminous Core Circuit Line */}
            <line geometry={lineGeo}>
              <lineBasicMaterial
                color="#38bdf8"
                transparent
                opacity={0.7}
                linewidth={2}
              />
            </line>

            {/* Glowing Anchor Beads at Spline Ends */}
            <mesh position={item.points[0]}>
              <sphereGeometry args={[0.028, 12, 12]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            <mesh position={item.points[item.points.length - 1]}>
              <sphereGeometry args={[0.028, 12, 12]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
