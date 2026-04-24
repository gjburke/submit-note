import { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Scratchpad } from './components/Scratchpad';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="flex h-full w-full flex-1">
      {isAuthenticated ? (
        <Scratchpad />
      ) : (
        <AuthScreen onLogin={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;
