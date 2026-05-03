import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { AuthScreen } from './components/AuthScreen';
import { Scratchpad } from './components/Scratchpad';
import './index.css';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // See if user is already signed in
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error checking session: ', error.message);
        supabase.auth.signOut();
      }

      setSession(session);
      setIsLoading(false);
    });

    // Listen for new sign ins
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="flex h-full w-full flex-1">Loading...</div>;
  }

  return (
    <div className="flex h-full w-full flex-1">
      {session ? <Scratchpad /> : <AuthScreen />}
    </div>
  );
}

export default App;
