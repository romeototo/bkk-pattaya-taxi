import { useContext, createContext } from 'react';
import { trpc } from './trpc';

interface User {
  id: number;
  email?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
});

export function useAuth() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  return {
    user: user as User | null,
    isLoading,
  };
}
