import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedToken = localStorage.getItem('emotionsync_token');
    const savedUser = localStorage.getItem('emotionsync_user');
    return {
      token: savedToken,
      user: savedUser ? JSON.parse(savedUser) : { id: 'demo_user', email: 'user@emotionsync.ai', full_name: 'Alex Rivera' },
      isAuthenticated: true // Demo mode enabled by default
    };
  });

  const login = (email: string, token: string, user: User) => {
    localStorage.setItem('emotionsync_token', token);
    localStorage.setItem('emotionsync_user', JSON.stringify(user));
    setAuthState({
      token,
      user,
      isAuthenticated: true
    });
  };

  const logout = () => {
    localStorage.removeItem('emotionsync_token');
    localStorage.removeItem('emotionsync_user');
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
