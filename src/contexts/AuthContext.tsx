import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole } from '@/config/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'fmcg_auth_user';

// Mock user IDs based on role
const MOCK_USER_IDS: Record<UserRole, { id: string; regionId?: string; areaId?: string; territoryId?: string; dsrId?: string }> = {
  RSM: { id: 'RSM1', regionId: 'R1' },
  ASM: { id: 'ASM1', regionId: 'R1', areaId: 'A1' },
  TSM: { id: 'TSM1', regionId: 'R1', areaId: 'A1', territoryId: 'T1' },
  SO: { id: 'SO1', regionId: 'R1', areaId: 'A1', territoryId: 'T1' },
  DSR: { id: 'DSR1', regionId: 'R1', areaId: 'A1', territoryId: 'T1', dsrId: 'DSR1' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = useCallback((role: UserRole, name: string) => {
    const mockIds = MOCK_USER_IDS[role];
    const newUser: User = {
      id: mockIds.id,
      name,
      role,
      regionId: mockIds.regionId,
      areaId: mockIds.areaId,
      territoryId: mockIds.territoryId,
      dsrId: mockIds.dsrId,
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
