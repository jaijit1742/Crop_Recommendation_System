import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Recommend from './pages/Recommend'

function App() {
  const location = useLocation()
  const isRecommendPage = location.pathname === '/recommend'

  return (
    <div className="min-h-screen flex flex-col bg-warm text-dark">
      {!isRecommendPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommend" element={<Recommend />} />
        </Routes>
      </main>
      {!isRecommendPage && (
        <footer className="py-8 text-center text-muted text-sm border-t border-sage/20 mt-auto">
          <p>© 2026 Kropelyx Inc. Empowering farmers with technology and support.</p>
        </footer>
      )}
    </div>
  )
}

export default App
