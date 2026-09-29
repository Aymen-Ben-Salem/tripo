import './App.css'
import { HeroBackground } from './components/HeroBackground'
import { HeroCopy } from './components/HeroCopy'
import { Navbar } from './components/Navbar'
import { AssetShowcase } from './features/assets/AssetShowcase'

function App() {
  return (
    <div className="hero">
      <HeroBackground />
      <Navbar />
      <main>
        <HeroCopy />
        <AssetShowcase />
      </main>
    </div>
  )
}

export default App
