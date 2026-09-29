import { lazy, Suspense, useState } from 'react'
import { assets } from './assets'
import { AssetSwitcher } from './AssetSwitcher'
import { AssetThumbnail } from './AssetThumbnail'
import './AssetShowcase.css'

const AssetStage = lazy(() => import('./AssetStage'))

export function AssetShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedAsset = assets[selectedIndex]

  return (
    <>
      <div className="asset-stage" aria-hidden="true">
        <Suspense fallback={<AssetThumbnail asset={selectedAsset} />}>
          <AssetStage asset={selectedAsset} />
        </Suspense>
      </div>
      <AssetSwitcher assets={assets} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
    </>
  )
}
