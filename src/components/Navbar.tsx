import './Navbar.css'
import { ExploreLink } from './ExploreLink'

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

      <ExploreLink className="navbar__explore" />
    </header>
  )
}
