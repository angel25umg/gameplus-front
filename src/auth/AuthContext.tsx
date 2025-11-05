import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  // 1. Al iniciar, leemos el estado desde localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuth') === 'true'
  );

  const login = () => {
    // 2. Al hacer login, guardamos el estado
    localStorage.setItem('isAuth', 'true');
    setIsAuthenticated(true);
    navigate('/'); // Redirige al dashboard
  };

  const logout = () => {
    // 3. Al cerrar sesión, limpiamos localStorage
    localStorage.removeItem('isAuth');
    setIsAuthenticated(false);
    navigate('/login'); // Redirige al login
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};