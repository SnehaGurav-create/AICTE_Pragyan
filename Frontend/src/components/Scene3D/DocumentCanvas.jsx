import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { DocumentScene } from './DocumentScene';
import { Fallback2DScene } from './Fallback2DScene';

// WebGL support detector
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Error Boundary for WebGL/Canvas crashes
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebGL Rendering Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function DocumentCanvas({ scrollProgress, activePhase, reducedMotion, onSelectPhase }) {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  const fallbackView = (
    <Fallback2DScene
      scrollProgress={scrollProgress}
      activePhase={activePhase}
      onSelectPhase={onSelectPhase}
    />
  );

  if (!hasWebGL) {
    return fallbackView;
  }

  return (
    <div className="three-canvas-wrapper" role="region" aria-label="3D Interactive Document Scene">
      <WebGLErrorBoundary fallback={fallbackView}>
        <Canvas
          shadows
          camera={{ position: [0, 0.4, 4.8], fov: 42, near: 0.1, far: 20 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <DocumentScene
            scrollProgress={scrollProgress}
            activePhase={activePhase}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
