import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthContext = ({ children, adminOnly = false }) => {
    if (!localStorage.getItem('userData')) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default AuthContext;