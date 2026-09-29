import { AssetThumbnail } from './AssetThumbnail'
import type { ShowcaseAsset } from './assets'

type AssetSwitcherProps = {
  assets: readonly ShowcaseAsset[]
  posters: Record<string, string>
  selectedIndex: number
  onSelect: (index: number) => void
}

function Arrow({ previous = false }: { previous?: boolean }) {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
      <path d={previous ? 'M17 8H3m5-5L3 8l5 5' : 'M3 8h14m-5-5 5 5-5 5'} stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function AssetSwitcher({ assets, posters, selectedIndex, onSelect }: AssetSwitcherProps) {
  const step = (direction: number) => onSelect((selectedIndex + direction + assets.length) % assets.length)

  return (
    <div className="asset-switcher" role="group" aria-label="Choose a speaker">
      <div className="asset-switcher__heading">
        <div className="asset-switcher__count" aria-hidden="true">
          <span>{String(selectedIndex + 1).padStart(2, '0')}</span>
          <span className="asset-switcher__total">/{String(assets.length).padStart(2, '0')}</span>
        </div>
        <div className="asset-switcher__arrows">
          <button className="asset-switcher__arrow" type="button" aria-label="Previous asset" onClick={() => step(-1)}>
            <Arrow previous />
          </button>
          <button className="asset-switcher__arrow" type="button" aria-label="Next asset" onClick={() => step(1)}>
            <Arrow />
          </button>
        </div>
      </div>
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
          </button>
        ))}
      </div>
      <span className="sr-only" role="status">{assets[selectedIndex].name}, {selectedIndex + 1} of {assets.length}</span>
    </div>
  )
}
