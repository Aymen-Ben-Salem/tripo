import './Navbar.css'

const navigation = ['Product', 'Technology', 'Design', 'Sound']

export function Navbar() {
  return (
    <header className="navbar">
      <a className="navbar__brand" href="/" aria-label="V — IX home">
        V — IX
      </a>

      <nav className="navbar__links" aria-label="Main navigation">
        {navigation.map((label) => (
          <a className="navbar__link" href={`#${label.toLowerCase()}`} key={label}>
            {label}
          </a>
        ))}
      </nav>

      <a className="navbar__explore" href="#product">
        <span>Explore Product</span>
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
          <path d="M1 7h14M11 3l4 4-4 4" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      </a>
    </header>
  )
}
