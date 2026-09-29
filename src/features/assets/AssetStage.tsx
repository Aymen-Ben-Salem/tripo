import { Canvas } from '@react-three/fiber'
import { Component, type ReactNode } from 'react'
import { AssetThumbnail } from './AssetThumbnail'
import type { ShowcaseAsset } from './assets'

class StageBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

// This renderer is the replacement point for the real model and its controls.
export default function AssetStage({ asset }: { asset: ShowcaseAsset }) {
  const fallback = <AssetThumbnail asset={asset} />

  return (
    <StageBoundary fallback={fallback}>
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 38 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{ alpha: true, antialias: true }}
        fallback={fallback}
      >
        <ambientLight intensity={0.8} />
        <hemisphereLight args={['#f5e9da', '#25252c', 2]} />
        <directionalLight position={[-3, 5, 4]} intensity={5} color="#fff0dc" />
        <directionalLight position={[4, 1, -2]} intensity={7} color="#c2d7fa" />
        <directionalLight position={[1, -3, 3]} intensity={2} color="#e5c4a1" />
        <mesh rotation={[0.3, -0.4, -0.2]}>
          <torusKnotGeometry args={[1.05, 0.29, 160, 24, ...asset.knot]} />
          <meshStandardMaterial color={asset.color} metalness={asset.metalness} roughness={asset.roughness} />
        </mesh>
      </Canvas>
    </StageBoundary>
  )
}
