import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // If tokens are not found, redirect to login page
    if (!accessToken || !refreshToken) {
        return <Navigate to="/login" />;
    }

    // If tokens are found, render the protected component
    return element;
};

export default PrivateRoute;
