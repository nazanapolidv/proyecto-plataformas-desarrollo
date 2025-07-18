import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading, user } = useAuth();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // Dar un momento para que el contexto se inicialice completamente
        const timer = setTimeout(() => {
            setChecked(true);
        }, 100);

        return () => clearTimeout(timer);
    }, [user]);

    console.log('🔍 AdminRoute Debug:');
    console.log('  Loading:', loading);
    console.log('  Checked:', checked);
    console.log('  User:', user);
    console.log('  IsAuthenticated:', isAuthenticated());
    console.log('  IsAdmin:', isAdmin());

    if (loading || !checked) {
        console.log('⏳ AdminRoute: Loading or not checked yet...');
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Cargando...</div>
            </div>
        );
    }

    if (!isAuthenticated()) {
        console.log('❌ AdminRoute: Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin()) {
        console.log('❌ AdminRoute: Not admin, redirecting to home');
        console.log('❌ User data:', user);
        return <Navigate to="/home" replace />;
    }

    console.log('✅ AdminRoute: Admin access granted');
    return children;
};

export default AdminRoute;
