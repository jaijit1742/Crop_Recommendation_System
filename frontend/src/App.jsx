import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Recommend from './pages/Recommend'
import CustomCursor from './components/CustomCursor'

function App() {
  const location = useLocation()
  const isRecommendPage = location.pathname === '/recommend' || location.pathname === '/dashboard'

  return (
    <div className="min-h-screen">
      <CustomCursor />
      {!isRecommendPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/dashboard" element={<Navigate to="/recommend" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
