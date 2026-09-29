import { Mesh, PerspectiveCamera, Vector3, type Object3D } from 'three'

// The farthest vertex from the rotation pivot stays within this radius at every angle.
export function getRotationRadius(model: Object3D) {
  model.updateWorldMatrix(true, true)
  const pivot = model.getWorldPosition(new Vector3())
  const vertex = new Vector3()
  let radiusSquared = 0
  model.traverse((object) => {
    if (!(object instanceof Mesh)) return
    const positions = object.geometry.getAttribute('position')
    if (!positions) return
    for (let index = 0; index < positions.count; index++) {
      vertex.fromBufferAttribute(positions, index).applyMatrix4(object.matrixWorld).sub(pivot)
      radiusSquared = Math.max(radiusSquared, vertex.lengthSq())
    }
  })
  return Math.sqrt(radiusSquared)
}

export function fitModelCamera(camera: PerspectiveCamera, radius: number, aspect: number) {
  const safeAspect = Math.max(aspect, 0.01)
  const verticalHalfFov = camera.fov * Math.PI / 360
  const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * safeAspect)
  // Include the hover translation and a small margin around the complete silhouette.
  const paddedRadius = (radius + 0.05) * 1.08
  const distance = Math.max(5.8, paddedRadius / Math.sin(Math.min(verticalHalfFov, horizontalHalfFov)))
  camera.aspect = safeAspect
  camera.position.set(0, 0, distance)
  camera.near = Math.max(0.01, distance - paddedRadius * 1.5)
  camera.far = distance + paddedRadius * 2
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()
  camera.updateMatrixWorld()
}
