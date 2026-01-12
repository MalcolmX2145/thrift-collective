import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { getApiUrl } from '../services/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (data: { name: string; email: string; password: string; phone: string }) => Promise<void>;
  setUser: (user: User) => void;
}

// Mock user for demo purposes
const mockUser: User = {
  id: 'user_001',
  email: 'demo@thriftcollective.co.ke',
  name: 'Demo User',
  phone: '0712345678',
  role: 'USER',
};

const mockAdmin: User = {
  id: 'admin_001',
  email: 'admin@thriftcollective.co.ke',
  name: 'Admin User',
  role: 'ADMIN',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch(`${getApiUrl()}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
          }

          const user = await response.json();
          // API returns user object directly, not wrapped
          set({ user, token: user.id, isAuthenticated: true });
        } catch (error: any) {
          throw new Error(error.message || 'Login failed');
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      signup: async (data) => {
        try {
          const response = await fetch(`${getApiUrl()}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Signup failed');
          }

          const resData = await response.json();
          // Backend signup returns { user, token }
          set({ user: resData.user, token: resData.token, isAuthenticated: true });
        } catch (error: any) {
          throw new Error(error.message || 'Signup failed');
        }
      },

      setUser: (user: User) => {
        set({ user, token: 'google_token', isAuthenticated: true });
      },
    }),
    {
      name: 'thrift-collective-auth',
    }
  )
);
