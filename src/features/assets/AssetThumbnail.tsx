import { useId } from 'react'
import type { ShowcaseAsset } from './assets'

export function AssetThumbnail({ asset }: { asset: ShowcaseAsset }) {
  const gradientId = useId()

  return (
    <svg viewBox="0 0 72 72" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="13" y1="9" x2="55" y2="63" gradientUnits="userSpaceOnUse">
          <stop stopColor={asset.highlight} />
          <stop offset="0.23" stopColor={asset.color} />
          <stop offset="0.48" stopColor="#171818" />
          <stop offset="0.7" stopColor={asset.highlight} />
          <stop offset="1" stopColor={asset.color} />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gradientId})`} strokeWidth="7">
        {Array.from({ length: asset.knot[1] }, (_, index) => (
          <ellipse key={index} cx="36" cy="36" rx="15" ry="25" transform={`rotate(${index * 180 / asset.knot[1] + 18} 36 36)`} />
        ))}
      </g>
    </svg>
  )
}
