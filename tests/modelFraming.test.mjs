import assert from 'node:assert/strict'
import test from 'node:test'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { BoxGeometry, BufferAttribute, BufferGeometry, Frustum, Group, Matrix4, Mesh, PerspectiveCamera, Quaternion, Vector3 } from 'three'
import { fitModelCamera, getRotationRadius } from '../src/features/assets/modelFraming.ts'
import { prepareModel } from '../src/features/assets/modelScene.ts'

function assertFitsAtEveryAngle(model, radius) {
  for (const aspect of [0.45, 0.7, 1, 1.45, 2.4]) {
    const camera = new PerspectiveCamera(38, aspect, 0.1, 100)
    fitModelCamera(camera, radius, aspect)
    const frustum = new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse))
    // Containment of the entire rotation sphere proves every orientation fits,
    // including the extra displacement from the hover animation.
    for (const plane of frustum.planes) assert(plane.distanceToPoint(new Vector3()) > radius + 0.05)
    for (const axis of [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(1, 1, 1).normalize()]) {
      for (const angle of [0, Math.PI / 4, Math.PI / 2, Math.PI]) {
        const quaternion = new Quaternion().setFromAxisAngle(axis, angle)
        model.traverse((object) => {
          if (!(object instanceof Mesh)) return
          const positions = object.geometry.getAttribute('position')
          const vertex = new Vector3()
          // Sample vertices across each actual model as an additional projection check.
          for (let index = 0; index < positions.count; index += Math.max(1, Math.floor(positions.count / 256))) {
            vertex.fromBufferAttribute(positions, index).applyMatrix4(object.matrixWorld).applyQuaternion(quaternion)
            vertex.x += 0.035
            vertex.y += 0.025
            const projected = vertex.project(camera)
            assert(Math.abs(projected.x) < 1 && Math.abs(projected.y) < 1 && Math.abs(projected.z) < 1)
          }
        })
      }
    }
  }
}

test('elongated models fit in portrait and landscape at every rotation', () => {
  const mesh = new Mesh(new BoxGeometry(3.2, 1, 2.8))
  const radius = getRotationRadius(mesh)
  assert(radius > 1.6)
  assertFitsAtEveryAngle(mesh, radius)
  mesh.geometry.dispose()
  mesh.material.dispose()
})

for (const filename of ['speaker-01.glb', 'speaker-02.glb', 'speaker-03.glb']) {
  test(`${filename}: all-angle framing contains the actual speaker geometry`, async () => {
    const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(`public/models/${filename}`)
    const model = new Group()
    function addNode(node, parent) {
      const group = new Group()
      group.matrix.fromArray(node.getMatrix())
      group.matrixAutoUpdate = false
      parent.add(group)
      for (const primitive of node.getMesh()?.listPrimitives() ?? []) {
        const geometry = new BufferGeometry()
        geometry.setAttribute('position', new BufferAttribute(primitive.getAttribute('POSITION').getArray(), 3))
        group.add(new Mesh(geometry))
      }
      for (const child of node.listChildren()) addNode(child, group)
    }
    for (const node of doc.getRoot().getDefaultScene().listChildren()) addNode(node, model)
    const prepared = prepareModel(model, { rotation: [0, 0, 0] })
    const radius = getRotationRadius(prepared)
    assert(radius >= 1.6)
    assertFitsAtEveryAngle(prepared, radius)
    model.traverse((object) => {
      if (object instanceof Mesh) { object.geometry.dispose(); object.material.dispose() }
    })
  })
}
