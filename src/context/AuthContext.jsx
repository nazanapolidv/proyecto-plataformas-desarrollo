import { createContext, useContext, useState, useEffect } from 'react';
import { usuariosService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario logueado al iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Verificar que el usuario todavía existe en la API
          const users = await usuariosService.obtenerTodos();
          const userExists = users.find(u => u.email === userData.email);
          if (userExists) {
            setUser(userData);
          } else {
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await usuariosService.login(email, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await usuariosService.crear(userData);
      return newUser;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (role) => {
    return user && user.rol === role;
  };

  const updateUser = async (updatedUserData) => {
    try {
      const updatedUser = await usuariosService.actualizar(user.email, updatedUserData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
