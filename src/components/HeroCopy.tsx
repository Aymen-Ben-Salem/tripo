import { ExploreLink } from './ExploreLink'
import './HeroCopy.css'

export function HeroCopy() {
  return (
    <section className="hero-copy" aria-labelledby="hero-title">
      <p className="hero-copy__eyebrow">Sculpted audio</p>
      <h1 className="hero-copy__title" id="hero-title">
        <span className="hero-copy__line">Form<span className="hero-copy__ampersand">&amp;</span></span>
        <span className="hero-copy__line">Sound</span>
      </h1>
      <p className="hero-copy__description">
        <span>Engineered to move sound.</span>
        <span>Shaped to move you.</span>
        <span>Where precision meets expression.</span>
      </p>
      <ExploreLink />
    </section>
  )
}
