import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminContext = ({ children }) => {
    const userDataString = localStorage.getItem('userData');

    try {
        const userData = JSON.parse(userDataString || '{}');
        if (!userData.is_admin) {
            return <Navigate to="/" replace />;
        }
        return children ? children : <Outlet />;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return <Navigate to="/" replace />;
    }
};

export default AdminContext;