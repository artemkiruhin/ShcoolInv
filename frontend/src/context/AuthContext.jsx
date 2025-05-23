import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthContext = ({ children }) => {
    const userDataString = localStorage.getItem('userData');

    if (!userDataString) {
        return <Navigate to="/login" replace />;
    }

    try {
        JSON.parse(userDataString);
        return children ? children : <Outlet />;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return <Navigate to="/login" replace />;
    }
};

export default AuthContext;