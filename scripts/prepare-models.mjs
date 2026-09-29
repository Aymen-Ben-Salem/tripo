import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, prune, simplify, weld } from '@gltf-transform/functions'
import { MeshoptSimplifier } from 'meshoptimizer'

const sourceDirectory = process.argv[2]
if (!sourceDirectory) throw new Error('Usage: node scripts/prepare-models.mjs <source-directory>')

const sources = [
  'futuristic speaker 3d model.glb',
  'futuristic+speaker+3d+model.glb',
  'speaker+3d+model.glb',
]
const destination = resolve('public/models')
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
await MeshoptSimplifier.ready
await mkdir(destination, { recursive: true })

for (const [index, filename] of sources.entries()) {
  const document = await io.read(resolve(sourceDirectory, filename))
  await document.transform(
    dedup(),
    weld(),
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.1, error: 0.001 }),
    prune(),
  )
  const output = resolve(destination, `speaker-0${index + 1}.glb`)
  await io.write(output, document)
  const triangles = document.getRoot().listMeshes().reduce((sum, mesh) =>
    sum + mesh.listPrimitives().reduce((count, primitive) => count + primitive.getIndices().getCount() / 3, 0), 0)
  console.log(`${output}: ${triangles.toLocaleString()} triangles`)
}
