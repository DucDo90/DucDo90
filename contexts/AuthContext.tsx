import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session on mount
    const storedUser = localStorage.getItem('ezai_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem('ezai_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: any) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email: data.email.includes('@') ? data.email : 'user@example.com', // Handle if input was phone
      phone: !data.email.includes('@') ? data.email : undefined,
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random&bold=true'
    };
    
    setUser(mockUser);
    if (data.rememberMe) {
      localStorage.setItem('ezai_user', JSON.stringify(mockUser));
    }
    setIsLoading(false);
  };

  const signup = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '2',
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&bold=true`
    };
    
    setUser(mockUser);
    localStorage.setItem('ezai_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    // Simulating Google Popup and auth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '3',
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=Google+User&background=DB4437&color=fff&bold=true' 
    };
    
    setUser(mockUser);
    localStorage.setItem('ezai_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ezai_user');
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate email sending
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      loginWithGoogle,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};