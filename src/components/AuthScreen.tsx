import React from 'react';
import { Apple } from 'lucide-react';

interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center"
      style={{ padding: '24px' }}
    >
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            background: 'var(--accent)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <span
            className="text-xl font-bold"
            style={{ color: 'var(--app-bg)', fontSize: '2rem' }}
          >
            N
          </span>
        </div>
        <h1 className="text-xl font-bold">Frictionless Notes</h1>
        <p className="text-secondary mt-2 text-sm">
          Sign in to sync your scratchpad.
        </p>
      </div>

      <button className="btn-auth apple" onClick={onLogin}>
        <Apple size={20} />
        Continue with Apple
      </button>

      <button className="btn-auth google" onClick={onLogin}>
        <span
          style={{
            width: 20,
            height: 20,
            background: '#eee',
            borderRadius: '50%',
            display: 'inline-block',
          }}
        ></span>
        Continue with Google
      </button>
    </div>
  );
};
