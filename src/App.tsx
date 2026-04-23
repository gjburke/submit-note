import React, { useState } from 'react'
import { AuthScreen } from './components/AuthScreen'
import { Scratchpad } from './components/Scratchpad'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div className="flex-1 flex w-full h-full">
      {isAuthenticated ? (
        <Scratchpad onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <AuthScreen onLogin={() => setIsAuthenticated(true)} />
      )}
    </div>
  )
}

export default App
