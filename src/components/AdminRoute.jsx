import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading, user } = useAuth();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setChecked(true);
        }, 100);

        return () => clearTimeout(timer);
    }, [user]);

    if (loading || !checked) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Cargando...</div>
            </div>
        );
    }

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/home" replace />;
    }
    return children;
};

export default AdminRoute;
