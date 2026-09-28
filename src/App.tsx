import './App.css'
import { HeroBackground } from './components/HeroBackground'
import { HeroCopy } from './components/HeroCopy'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <div className="hero">
      <HeroBackground />
      <Navbar />
      <main>
        <HeroCopy />
      </main>
    </div>
  )
}

export default App
