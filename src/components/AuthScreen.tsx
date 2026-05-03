import React from 'react';

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
        <h1 className="text-xl font-bold">Submit Notes</h1>
        <p className="text-secondary mt-2 text-sm">
          Sign in to sync your scratchpad.
        </p>
      </div>

      <button className="btn-auth" onClick={onLogin}>
        Continue with GitHub
      </button>
    </div>
  );
};
