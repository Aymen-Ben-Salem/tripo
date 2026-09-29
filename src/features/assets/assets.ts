export type ShowcaseAsset = {
  id: string
  name: string
  modelUrl: string
  rotation: [number, number, number]
}

export const assets: readonly ShowcaseAsset[] = [
  { id: 'speaker-01', name: 'Speaker 01', modelUrl: '/models/speaker-01.glb', rotation: [0, 0, 0] },
  { id: 'speaker-02', name: 'Speaker 02', modelUrl: '/models/speaker-02.glb', rotation: [0, 0, 0] },
  { id: 'speaker-03', name: 'Speaker 03', modelUrl: '/models/speaker-03.glb', rotation: [0, 0, 0] },
]
