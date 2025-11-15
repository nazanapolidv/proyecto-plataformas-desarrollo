import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            verifyToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await apiService.verifyToken(token);
            setUser(response.user);
            localStorage.setItem('token', token);
        } catch (error) {
            console.error('Token inválido:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await apiService.login(email, password);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            return { success: true, user: response.user };
        } catch (error) {
            console.error('Error en login:', error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Error al iniciar sesión' 
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await apiService.register(userData);
            setUser(response.user);
            localStorage.setItem('token', response.token);
            return { success: true, user: response.user };
        } catch (error) {
            console.error('Error en registro:', error);
            return { 
                success: false, 
                error: error.response?.data?.error || 'Error al registrar usuario' 
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    const isAdmin = () => {
        return user?.rol === 'admin';
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
