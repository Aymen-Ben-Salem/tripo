import { lazy, Suspense, useCallback, useState } from 'react'
import { assets } from './assets'
import { AssetSwitcher } from './AssetSwitcher'
import './AssetShowcase.css'

const AssetStage = lazy(() => import('./AssetStage'))

export function AssetShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedAsset = assets[selectedIndex]
  const [posters, setPosters] = useState<Record<string, string>>({})
  const onPosterReady = useCallback((id: string, src: string) => {
    setPosters((current) => current[id] === src ? current : { ...current, [id]: src })
  }, [])

  return (
    <>
      <div className="asset-stage" aria-hidden="true">
        <Suspense fallback={<span className="asset-stage__message">Loading preview</span>}>
          <AssetStage asset={selectedAsset} onPosterReady={onPosterReady} />
        </Suspense>
      </div>
      <AssetSwitcher assets={assets} posters={posters} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
    </>
  )
}
