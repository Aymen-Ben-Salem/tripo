import { Box3, DirectionalLight, Group, HemisphereLight, PerspectiveCamera, Scene, SRGBColorSpace, Vector3, WebGLRenderTarget, type Object3D, type WebGLRenderer } from 'three'
import type { ShowcaseAsset } from './assets'

export const cameraPosition: [number, number, number] = [0, 0, 5.8]
export const cameraFov = 38

export function prepareModel(source: Object3D, asset: ShowcaseAsset) {
  const model = source.clone(true)
  const bounds = new Box3().setFromObject(model)
  const center = bounds.getCenter(new Vector3())
  const size = bounds.getSize(new Vector3())
  const scale = 3.2 / Math.max(size.x, size.y, size.z)
  const centered = new Group()
  model.position.sub(center)
  centered.add(model)
  centered.scale.setScalar(scale)
  const rotated = new Group()
  rotated.add(centered)
  rotated.rotation.set(...asset.rotation)
  return rotated
}

export function createStudioLights() {
  const lights = new Group()
  lights.add(new HemisphereLight('#fff4e6', '#43454d', 1.8))
  const key = new DirectionalLight('#fff1de', 2.5)
  key.position.set(-3, 5, 4)
  const rim = new DirectionalLight('#c2d7fa', 3)
  rim.position.set(4, 1, -2)
  const fill = new DirectionalLight('#ffffff', 0.7)
  fill.position.set(1, -2, 3)
  lights.add(key, rim, fill)
  return lights
}

// Reuse the scene's renderer for thumbnails instead of creating more WebGL contexts.
export function renderThumbnail(renderer: WebGLRenderer, model: Object3D) {
  const size = 192
  const scene = new Scene()
  scene.add(model.clone(true), createStudioLights())
  const camera = new PerspectiveCamera(cameraFov, 1, 0.1, 100)
  camera.position.set(...cameraPosition)
  const target = new WebGLRenderTarget(size, size, { samples: 4 })
  target.texture.colorSpace = SRGBColorSpace
  const previousTarget = renderer.getRenderTarget()
  try {
    renderer.setRenderTarget(target)
    renderer.clear()
    renderer.render(scene, camera)
    const pixels = new Uint8Array(size * size * 4)
    renderer.readRenderTargetPixels(target, 0, 0, size, size, pixels)
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) return undefined
    const image = context.createImageData(size, size)
    for (let row = 0; row < size; row++) {
      const start = (size - row - 1) * size * 4
      image.data.set(pixels.subarray(start, start + size * 4), row * size * 4)
    }
    context.putImageData(image, 0, 0)
    return canvas.toDataURL('image/png')
  } finally {
    renderer.setRenderTarget(previousTarget)
    target.dispose()
  }
}
