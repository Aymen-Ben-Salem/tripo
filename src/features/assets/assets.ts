export type ShowcaseAsset = {
  id: string
  name: string
  color: string
  highlight: string
  metalness: number
  roughness: number
  knot: [number, number]
}

// Temporary geometry and finishes. Replace these entries with the supplied models.
export const assets: readonly ShowcaseAsset[] = [
  { id: 'ceramic', name: 'Ceramic', color: '#bca58b', highlight: '#f5e5d0', metalness: 0.55, roughness: 0.26, knot: [2, 3] },
  { id: 'chrome', name: 'Chrome', color: '#969da5', highlight: '#edf1f7', metalness: 0.85, roughness: 0.2, knot: [3, 4] },
  { id: 'graphite', name: 'Graphite', color: '#353638', highlight: '#959798', metalness: 0.45, roughness: 0.38, knot: [2, 5] },
]
