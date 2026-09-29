import type { ShowcaseAsset } from './assets'

export function AssetThumbnail({ asset, src }: { asset: ShowcaseAsset; src?: string }) {
  return src
    ? <img src={src} alt="" draggable={false} />
    : <span className="asset-thumbnail-placeholder" aria-hidden="true">{asset.name.slice(-2)}</span>
}
