import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createDocumentTexture, DOCUMENT_CONFIGS } from './generateDocumentTexture';

export function GlassDocumentSheet({
  index,
  scrollProgress,
  activeStage,
  reducedMotion,
}) {
  const meshGroupRef = useRef();
  const config = DOCUMENT_CONFIGS[index];

  // Procedural high-resolution document canvas texture
  const texture = useMemo(() => {
    return createDocumentTexture(config);
  }, [config]);

  // Spatial coordinates for all 5 stages:
  // Stage A (0.00 - 0.18): Hero stacked view, centered-right for headline clearance
  // Stage B (0.18 - 0.42): 3D Volumetric layer separation
  // Stage C (0.42 - 0.68): Intelligent scanning & node illumination
  // Stage D (0.68 - 0.88): Discrepancy identification & circuit link
  // Stage E (0.88 - 1.00): Reassembled dossier transitioning into dashboard
  const layout = useMemo(() => {
    return {
      // Stage A: Consolidated floating stack, angled hero pose
      stacked: {
        pos: [0.65, (index - 1.5) * 0.06, (index - 1.5) * 0.14],
        rot: [0.18, -0.22, 0.04 + index * 0.015],
      },
      // Stage B, C, D: Exploded volumetric separation
      exploded: [
        { pos: [-1.85, 0.72, 0.35], rot: [0.16, 0.32, -0.05] },  // Sheet 0: Land Title
        { pos: [-0.92, -0.68, 0.78], rot: [-0.12, 0.22, 0.04] }, // Sheet 1: Fire NOC
        { pos: [0.88, 0.65, 0.88], rot: [0.14, -0.24, 0.06] },   // Sheet 2: Faculty Cadre
        { pos: [1.88, -0.58, 0.25], rot: [-0.10, -0.32, -0.05] }, // Sheet 3: Finance Escrow
      ][index],
      // Stage E: Reassembled authenticated compliance portfolio
      assembled: {
        pos: [(index - 1.5) * 0.08, 0.2 + (index - 1.5) * 0.03, (index - 1.5) * 0.06],
        rot: [0.08, -0.06, 0.01 * index],
      },
    };
  }, [index]);

  // Animation update loop
  useFrame((state, delta) => {
    if (!meshGroupRef.current) return;
    const group = meshGroupRef.current;
    const time = state.clock.getElapsedTime();

    // Idle floating physics (gentle harmonic levitation)
    const floatY = reducedMotion ? 0 : Math.sin(time * 1.6 + index * 0.9) * 0.04;
    const floatRot = reducedMotion ? 0 : Math.cos(time * 1.2 + index * 0.6) * 0.015;

    let targetPos = [0, 0, 0];
    let targetRot = [0, 0, 0];

    if (scrollProgress < 0.18) {
      // Stage A: Stacked hero pose
      targetPos = layout.stacked.pos;
      targetRot = layout.stacked.rot;
    } else if (scrollProgress < 0.82) {
      // Stage B, C, D: Transition smoothly into exploded view
      const t = Math.min(1, Math.max(0, (scrollProgress - 0.18) / 0.16));
      targetPos = [
        THREE.MathUtils.lerp(layout.stacked.pos[0], layout.exploded.pos[0], t),
        THREE.MathUtils.lerp(layout.stacked.pos[1], layout.exploded.pos[1], t),
        THREE.MathUtils.lerp(layout.stacked.pos[2], layout.exploded.pos[2], t),
      ];
      targetRot = [
        THREE.MathUtils.lerp(layout.stacked.rot[0], layout.exploded.rot[0], t),
        THREE.MathUtils.lerp(layout.stacked.rot[1], layout.exploded.rot[1], t),
        THREE.MathUtils.lerp(layout.stacked.rot[2], layout.exploded.rot[2], t),
      ];
    } else {
      // Stage E: Reassembled verified dossier
      const t = Math.min(1, Math.max(0, (scrollProgress - 0.82) / 0.14));
      targetPos = [
        THREE.MathUtils.lerp(layout.exploded.pos[0], layout.assembled.pos[0], t),
        THREE.MathUtils.lerp(layout.exploded.pos[1], layout.assembled.pos[1], t),
        THREE.MathUtils.lerp(layout.exploded.pos[2], layout.assembled.pos[2], t),
      ];
      targetRot = [
        THREE.MathUtils.lerp(layout.exploded.rot[0], layout.assembled.rot[0], t),
        THREE.MathUtils.lerp(layout.exploded.rot[1], layout.assembled.rot[1], t),
        THREE.MathUtils.lerp(layout.exploded.rot[2], layout.assembled.rot[2], t),
      ];
    }

    // Apply smooth interpolation
    const speed = reducedMotion ? 1 : 6.0 * delta;
    group.position.x = THREE.MathUtils.lerp(group.position.x, targetPos[0], speed);
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetPos[1] + floatY, speed);
    group.position.z = THREE.MathUtils.lerp(group.position.z, targetPos[2], speed);

    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRot[0] + floatRot, speed);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRot[1] + floatRot * 0.6, speed);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetRot[2], speed);
  });

  // Physical document slab dimensions
  const sheetWidth = 1.62;
  const sheetHeight = 2.16;
  const sheetThickness = 0.032;

  const showVerification = scrollProgress >= 0.38;
  const showDiscrepancy = scrollProgress >= 0.52 && config.hasDiscrepancy;

  return (
    <group ref={meshGroupRef}>
      {/* 1. Realistic Architectural Glass Slab */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[sheetWidth, sheetHeight, sheetThickness]} />
        <meshPhysicalMaterial
          roughness={0.08}
          transmission={0.92}
          thickness={0.8}
          ior={1.54}
          reflectivity={0.6}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transparent={true}
          opacity={0.94}
          color="#ffffff"
          attenuationColor="#e0f2fe"
          attenuationDistance={1.4}
        />
      </mesh>

      {/* 2. Chamfer Rim Edge Highlight */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(sheetWidth, sheetHeight, sheetThickness)]} />
        <lineBasicMaterial
          color={showDiscrepancy ? '#f87171' : showVerification ? '#38bdf8' : '#cbd5e1'}
          transparent
          opacity={0.65}
          linewidth={1.5}
        />
      </lineSegments>

      {/* 3. High-Fidelity Front Document Surface */}
      <mesh position={[0, 0, sheetThickness / 2 + 0.003]}>
        <planeGeometry args={[sheetWidth - 0.03, sheetHeight - 0.03]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          opacity={0.96}
          toneMapped={false}
        />
      </mesh>

      {/* 4. Glowing Circular Verification Nodes */}
      {/* Node 1: Top Right Authority Seal Node */}
      <group position={[sheetWidth * 0.36, sheetHeight * 0.38, sheetThickness / 2 + 0.025]}>
        <mesh>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshBasicMaterial
            color={showDiscrepancy ? '#ef4444' : showVerification ? '#10b981' : '#38bdf8'}
          />
        </mesh>
        {showVerification && (
          <mesh>
            <ringGeometry args={[0.042, 0.058, 24]} />
            <meshBasicMaterial
              color={showDiscrepancy ? '#ef4444' : '#10b981'}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>

      {/* Node 2: Parameter Checkpoint Node */}
      <group position={[-sheetWidth * 0.36, -sheetHeight * 0.38, sheetThickness / 2 + 0.025]}>
        <mesh>
          <sphereGeometry args={[0.026, 16, 16]} />
          <meshBasicMaterial
            color={showVerification ? '#10b981' : '#64748b'}
          />
        </mesh>
        {showVerification && (
          <mesh>
            <ringGeometry args={[0.034, 0.046, 24]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>

      {/* 5. Illustrative Anomaly Marker (Sheet 2: Faculty Cadre Shortfall) */}
      {showDiscrepancy && (
        <group position={[0.25, 0.08, 0.14]}>
          {/* Pulsing Beacon Sphere */}
          <mesh>
            <sphereGeometry args={[0.052, 16, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>

          {/* Double Warning Rings */}
          <mesh>
            <ringGeometry args={[0.068, 0.092, 24]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.75} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.11, 0.13, 24]} />
            <meshBasicMaterial color="#f87171" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>

          {/* 3D Callout Pointer Line */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0, 0, 0.32, 0.28, 0.12])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ef4444" transparent opacity={0.9} linewidth={2} />
          </lineSegments>
        </group>
      )}
    </group>
  );
}
