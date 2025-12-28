import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (data: { name: string; email: string; password: string; phone: string }) => Promise<void>;
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
        // Mock login - in production, this would call an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email === 'admin@thriftcollective.co.ke' && password === 'admin123') {
          set({ user: mockAdmin, token: 'mock_admin_token', isAuthenticated: true });
        } else if (password === 'demo123') {
          set({ user: { ...mockUser, email }, token: 'mock_token', isAuthenticated: true });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      signup: async (data) => {
        // Mock signup - in production, this would call an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          id: `user_${Date.now()}`,
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: 'USER',
        };
        
        set({ user: newUser, token: 'mock_token', isAuthenticated: true });
      },
    }),
    {
      name: 'thrift-collective-auth',
    }
  )
);
