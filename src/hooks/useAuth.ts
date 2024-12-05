import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  userId: number | null;
  setUserId: (id: number | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isAuthenticated: false,
      setToken: (token) => set({ 
        token, 
        isAuthenticated: !!token 
      }),
      setUserId: (id) => set({ userId: id }),
    }),
    {
      name: 'auth-storage',
    }
  )
); 