import { createContext, useContext, ReactNode } from 'react';
import { useKV } from '@github/spark/hooks';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (credentials: { username: string; password: string }) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  resetAllUserCredits: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Imperial users for demo purposes
const mockUsers: User[] = [
  {
    id: 'tarkin',
    name: 'Grand Moff Tarkin',
    rank: 'Grand Moff',
    clearanceLevel: 10,
    department: 'Imperial High Command',
    credits: 500000000
  },
  {
    id: 'veers',
    name: 'General Veers',
    rank: 'General',
    clearanceLevel: 8,
    department: 'Imperial Army',
    credits: 50000000
  },
  {
    id: 'piett',
    name: 'Admiral Piett',
    rank: 'Admiral',
    clearanceLevel: 7,
    department: 'Imperial Navy',
    credits: 100000000
  },
  {
    id: 'vader',
    name: 'Lord Vader',
    rank: 'Dark Lord of the Sith',
    clearanceLevel: 10,
    department: 'Imperial High Command',
    credits: 1000000000
  },
  {
    id: 'ozzel',
    name: 'Admiral Ozzel',
    rank: 'Admiral',
    clearanceLevel: 6,
    department: 'Imperial Navy',
    credits: 25000000
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useKV<User | null>('imperial-user', null);
  // Store all user credits separately so we can reset them all
  const [userCredits, setUserCredits] = useKV<Record<string, number>>('user-credits', 
    Object.fromEntries(mockUsers.map(u => [u.id, u.credits]))
  );

  const login = (credentials: { username: string; password: string }) => {
    // Mock authentication - in production, this would verify against secure backend
    const foundUser = mockUsers.find(u => 
      u.id.toLowerCase() === credentials.username.toLowerCase() && 
      credentials.password === 'empire' // Simple demo password
    );

    if (foundUser) {
      // Use stored credits if available, otherwise use default
      const currentCredits = userCredits?.[foundUser.id] ?? foundUser.credits;
      const userWithCurrentCredits = { ...foundUser, credits: currentCredits };
      setUser(userWithCurrentCredits);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const deductCredits = (amount: number): boolean => {
    if (!user || user.credits < amount) {
      return false;
    }
    
    const updatedUser = { ...user, credits: user.credits - amount };
    setUser(updatedUser);
    
    // Also update the persistent credits store
    setUserCredits((currentCredits) => ({
      ...currentCredits,
      [user.id]: updatedUser.credits
    }));
    
    return true;
  };

  const addCredits = (amount: number) => {
    if (!user) return;
    
    const updatedUser = { ...user, credits: user.credits + amount };
    setUser(updatedUser);
    
    // Also update the persistent credits store
    setUserCredits((currentCredits) => ({
      ...currentCredits,
      [user.id]: updatedUser.credits
    }));
  };

  const resetAllUserCredits = () => {
    // Reset all user credits to their original amounts
    const originalCredits = Object.fromEntries(mockUsers.map(u => [u.id, u.credits]));
    setUserCredits(originalCredits);
    
    // If current user is logged in, update their user object too
    if (user) {
      const originalUser = mockUsers.find(u => u.id === user.id);
      if (originalUser) {
        const resetUser = { ...user, credits: originalUser.credits };
        setUser(resetUser);
      }
    }
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{
      user: user ?? null,
      login,
      logout,
      isAuthenticated,
      deductCredits,
      addCredits,
      resetAllUserCredits
    }}>
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