import { AssetThumbnail } from './AssetThumbnail'
import type { ShowcaseAsset } from './assets'

type AssetSwitcherProps = {
  assets: readonly ShowcaseAsset[]
  posters: Record<string, string>
  selectedIndex: number
  onSelect: (index: number) => void
}

function Chevron({ previous = false }: { previous?: boolean }) {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
      <path d={previous ? 'M9 3 3 10l6 7' : 'm3 3 6 7-6 7'} stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function AssetSwitcher({ assets, posters, selectedIndex, onSelect }: AssetSwitcherProps) {
  const step = (direction: number) => onSelect((selectedIndex + direction + assets.length) % assets.length)

  return (
    <div className="asset-switcher" role="group" aria-label="Choose a speaker">
      <button className="asset-switcher__arrow" type="button" aria-label="Previous asset" onClick={() => step(-1)}>
        <Chevron previous />
      </button>
      <div className="asset-switcher__options">
        {assets.map((asset, index) => (
          <button
            key={asset.id}
            className="asset-switcher__option"
            type="button"
            aria-label={`Show ${asset.name}`}
            aria-pressed={index === selectedIndex}
            onClick={() => onSelect(index)}
          >
            <span className="asset-switcher__thumbnail"><AssetThumbnail asset={asset} src={posters[asset.id]} /></span>
            <span className="asset-switcher__dot" aria-hidden="true" />
          </button>
        ))}
      </div>
      <button className="asset-switcher__arrow" type="button" aria-label="Next asset" onClick={() => step(1)}>
        <Chevron />
      </button>
      <span className="sr-only" role="status">{assets[selectedIndex].name}, {selectedIndex + 1} of {assets.length}</span>
    </div>
  )
}
