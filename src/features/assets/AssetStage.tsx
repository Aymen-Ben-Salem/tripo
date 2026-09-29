import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Component, Suspense, useEffect, useMemo, type ReactNode } from 'react'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { assets, type ShowcaseAsset } from './assets'
import { cameraFov, cameraPosition, createStudioLights, prepareModel, renderThumbnail } from './modelScene'

type PosterReady = (id: string, src: string) => void

type BoundaryProps = { children: ReactNode; fallback: ReactNode; resetKey?: string }
type BoundaryState = { failed: boolean; resetKey?: string }

class StageBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false }
  static getDerivedStateFromProps(props: BoundaryProps, state: BoundaryState) {
    return props.resetKey !== state.resetKey ? { failed: false, resetKey: props.resetKey } : null
  }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

function useModel(asset: ShowcaseAsset) {
  const { scene } = useLoader(GLTFLoader, asset.modelUrl)
  return useMemo(() => prepareModel(scene, asset), [scene, asset])
}

function Model({ asset }: { asset: ShowcaseAsset }) {
  const model = useModel(asset)
  return <primitive object={model} dispose={null} />
}

function ThumbnailCapture({ asset, onReady }: { asset: ShowcaseAsset; onReady: PosterReady }) {
  const model = useModel(asset)
  const { gl, invalidate } = useThree()
  useEffect(() => {
    const src = renderThumbnail(gl, model)
    if (src) onReady(asset.id, src)
    invalidate()
  }, [asset.id, gl, invalidate, model, onReady])
  return null
}

function StudioLights() {
  const lights = useMemo(() => createStudioLights(), [])
  return <primitive object={lights} />
}

export default function AssetStage({ asset, onPosterReady }: { asset: ShowcaseAsset; onPosterReady: PosterReady }) {
  return (
    <StageBoundary resetKey={asset.id} fallback={<span className="asset-stage__message">Preview unavailable</span>}>
      <Canvas camera={{ position: cameraPosition, fov: cameraFov }} dpr={[1, 1.5]} frameloop="demand"
        gl={{ alpha: true, antialias: true }}
        fallback={<span className="asset-stage__message">3D preview unavailable</span>}>
        <StudioLights />
        <Suspense fallback={null}><Model asset={asset} /></Suspense>
        {assets.map((entry) => (
          <StageBoundary key={entry.id} fallback={null}>
            <Suspense fallback={null}>
              <ThumbnailCapture asset={entry} onReady={onPosterReady} />
            </Suspense>
          </StageBoundary>
        ))}
      </Canvas>
    </StageBoundary>
  )
}
