import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GlassDocumentSheet } from './GlassDocumentSheet';
import { ScanningLaser } from './ScanningLaser';
import { CircuitConnections } from './CircuitConnections';
import { DOCUMENT_CONFIGS } from './generateDocumentTexture';

export function DocumentScene({ scrollProgress, activeStage, reducedMotion }) {
  const { camera } = useThree();
  const sceneRootRef = useRef();
  const sealBadgeRef = useRef();

  // Cinematic Dynamic Camera Movement across 5 Stages
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Subtle natural camera sway (disabled in reduced motion)
    const swayX = reducedMotion ? 0 : Math.sin(time * 0.9) * 0.04;
    const swayY = reducedMotion ? 0 : Math.cos(time * 0.7) * 0.025;

    let targetCamPos = [0, 0.25, 4.8];
    let lookTarget = [0, 0, 0];

    if (scrollProgress < 0.18) {
      // Stage A: Initial Hero View (angled, centered-right for headline clearance)
      targetCamPos = [0.2, 0.25, 4.7];
      lookTarget = [0.35, 0.05, 0];
    } else if (scrollProgress < 0.42) {
      // Stage B: Exploded 3D view (fly-through between separated layers)
      const t = (scrollProgress - 0.18) / (0.42 - 0.18);
      targetCamPos = [
        THREE.MathUtils.lerp(0.2, 0.0, t),
        THREE.MathUtils.lerp(0.25, 0.05, t),
        THREE.MathUtils.lerp(4.7, 4.3, t),
      ];
      lookTarget = [0, 0, 0];
    } else if (scrollProgress < 0.68) {
      // Stage C: Intelligent optical & cadastral scanning
      targetCamPos = [0.12, 0.08, 4.2];
      lookTarget = [0.05, 0.0, 0];
    } else if (scrollProgress < 0.88) {
      // Stage D: Discrepancy beacon focus on Sheet 2 (Faculty Cadre)
      targetCamPos = [0.42, 0.22, 4.0];
      lookTarget = [0.45, 0.25, 0.4];
    } else {
      // Stage E: Camera elevates and pulls back for seamless dashboard transition
      const t = (scrollProgress - 0.88) / (1.00 - 0.88);
      targetCamPos = [
        THREE.MathUtils.lerp(0.42, 0.0, t),
        THREE.MathUtils.lerp(0.22, 0.75, t),
        THREE.MathUtils.lerp(4.0, 5.0, t),
      ];
      lookTarget = [0, 0.3, 0];
    }

    const speed = reducedMotion ? 1 : 5.0 * delta;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamPos[0] + swayX, speed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamPos[1] + swayY, speed);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamPos[2], speed);

    camera.lookAt(lookTarget[0], lookTarget[1], lookTarget[2]);

    // Stage E Verified Compliance Seal Animation
    if (sealBadgeRef.current) {
      const showSeal = scrollProgress >= 0.84;
      const targetScale = showSeal ? 1 : 0.001;
      const stampSpeed = 8 * delta;
      sealBadgeRef.current.scale.x = THREE.MathUtils.lerp(sealBadgeRef.current.scale.x, targetScale, stampSpeed);
      sealBadgeRef.current.scale.y = THREE.MathUtils.lerp(sealBadgeRef.current.scale.y, targetScale, stampSpeed);
      sealBadgeRef.current.scale.z = THREE.MathUtils.lerp(sealBadgeRef.current.scale.z, targetScale, stampSpeed);
    }
  });

  return (
    <group ref={sceneRootRef}>
      {/* 1. Cinematic Studio Lighting System */}
      <ambientLight intensity={1.2} color="#ffffff" />

      {/* Main Overhead Studio Soft Light */}
      <directionalLight
        position={[4, 6, 6]}
        intensity={1.6}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Warm Porcelain Fill Light */}
      <directionalLight
        position={[-5, 3, 4]}
        intensity={0.9}
        color="#fefefe"
      />

      {/* Electric-Blue Accent Light catching glass edges */}
      <pointLight
        position={[0, 3.2, 2.5]}
        intensity={1.4}
        distance={7}
        color="#38bdf8"
        decay={2}
      />

      {/* Subtle Cyan Back Rim Light */}
      <pointLight
        position={[0, -2, -3]}
        intensity={0.8}
        color="#93c5fd"
      />

      {/* 2. Four Transparent Glass Document Sheets */}
      {DOCUMENT_CONFIGS.map((doc, idx) => (
        <GlassDocumentSheet
          key={doc.id}
          index={idx}
          scrollProgress={scrollProgress}
          activeStage={activeStage}
          reducedMotion={reducedMotion}
        />
      ))}

      {/* 3. Luminous Traveling Scanning Laser Beam */}
      <ScanningLaser
        scrollProgress={scrollProgress}
        active={scrollProgress >= 0.36 && scrollProgress <= 0.84}
        reducedMotion={reducedMotion}
      />

      {/* 4. Cross-Document Circuit Connection Splines */}
      <CircuitConnections
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
      />

      {/* 5. Official AICTE Verified Seal Badge in 3D (Appears in Stage E) */}
      <group ref={sealBadgeRef} position={[0, 0.2, 0.42]} scale={[0.001, 0.001, 0.001]}>
        {/* Outer Circular Ring */}
        <mesh>
          <torusGeometry args={[0.44, 0.016, 16, 64]} />
          <meshStandardMaterial color="#059669" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Inner Glowing Shield Disc */}
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[0.42, 32]} />
          <meshBasicMaterial color="#ecfdf5" transparent opacity={0.9} />
        </mesh>

        {/* Verification Checkmark Symbol */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.09, 0.24, 0.02]} />
          <meshStandardMaterial color="#059669" />
        </mesh>
      </group>

      {/* 6. Soft Studio Contact Shadow Plane on Porcelain Floor */}
      <mesh position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial color="#f6f5f0" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}
