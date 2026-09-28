import './ExploreLink.css'

type ExploreLinkProps = {
  className?: string
}

export function ExploreLink({ className = '' }: ExploreLinkProps) {
  return (
    <a className={`explore-link ${className}`.trim()} href="#product">
      <span>Explore Product</span>
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
        <path d="M1 7h14M11 3l4 4-4 4" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    </a>
  )
}
