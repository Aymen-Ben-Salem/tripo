import './App.css'

function App() {
  return (
    <main className="hero" aria-label="Tripo">
      <svg
        className="hero__background"
        viewBox="0 0 1672 941"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id="ambient">
            <stop stopColor="#70675e" stopOpacity="0.42" />
            <stop offset="0.5" stopColor="#554e47" stopOpacity="0.2" />
            <stop offset="1" stopColor="#403c37" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="light">
            <stop stopColor="#9c8772" stopOpacity="0.43" />
            <stop offset="0.25" stopColor="#887766" stopOpacity="0.29" />
            <stop offset="0.6" stopColor="#6a6055" stopOpacity="0.12" />
            <stop offset="1" stopColor="#655a50" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow">
            <stop stopColor="#a99b8c" stopOpacity="0.79" />
            <stop offset="0.22" stopColor="#938577" stopOpacity="0.52" />
            <stop offset="0.5" stopColor="#796e64" stopOpacity="0.26" />
            <stop offset="1" stopColor="#655c53" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="shade">
            <stop offset="0.2" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.4" />
          </radialGradient>
          <filter id="haze" x="-30%" y="-100%" width="160%" height="300%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.009 0.016" numOctaves="3" seed="12" result="clouds" />
            <feDisplacementMap in="SourceGraphic" in2="clouds" scale="32" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="grain" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="8" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <path fill="#101111" d="M0 0h1672v941H0z" />
        {/* Procedural light and texture, scaled as a complete composition. */}
        <ellipse cx="965" cy="172" rx="1020" ry="660" fill="url(#ambient)" />
        <ellipse cx="1030" cy="262" rx="595" ry="263" transform="rotate(-47 1030 262)" fill="url(#ambient)" opacity="0.7" />
        <g filter="url(#haze)">
          <ellipse cx="570" cy="619" rx="780" ry="100" transform="rotate(-30 570 619)" fill="url(#light)" opacity="0.43" />
          <ellipse cx="813" cy="785" rx="664" ry="108" transform="rotate(-26 813 785)" fill="url(#light)" opacity="0.82" />
          <ellipse cx="794" cy="791" rx="490" ry="25" transform="rotate(-26 794 791)" fill="url(#light)" opacity="0.69" />
        </g>
        <path fill="url(#shade)" d="M0 0h1672v941H0z" />
        <ellipse cx="1320" cy="-55" rx="375" ry="410" fill="url(#glow)" />
        <path filter="url(#grain)" opacity="0.035" d="M0 0h1672v941H0z" />
      </svg>
    </main>
  )
}

export default App
