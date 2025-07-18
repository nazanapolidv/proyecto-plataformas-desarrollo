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
        console.log('🔄 AuthContext useEffect: Initializing...');
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        console.log('🔍 Stored token:', token ? 'exists' : 'not found');
        console.log('🔍 Stored user:', storedUser ? 'exists' : 'not found');
        
        if (token && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                console.log('✅ Parsed stored user:', user);
                setUser(user);
                setLoading(false);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setLoading(false);
            }
        } else {
            console.log('❌ No stored credentials found');
            setLoading(false);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await apiService.verifyToken(token);
            setUser(response.user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return true;
        } catch (error) {
            console.error('Token inválido:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            return false;
        }
    };

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const isValid = await verifyToken(token);
            return isValid;
        }
        return false;
    };

    const login = async (email, password) => {
        try {
            const response = await apiService.login(email, password);
            console.log('✅ Login successful - User:', response.user);
            
            setUser(response.user);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
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
            localStorage.setItem('user', JSON.stringify(response.user));
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
        localStorage.removeItem('user');
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    const isAdmin = () => {
        const result = user?.rol === 'admin';
        console.log('🔍 isAdmin check - User:', user?.nombre, 'Role:', user?.rol, 'IsAdmin:', result);
        return result;
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        updateUser,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
