import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ element }) => {
    const accessToken = localStorage.getItem('accessToken');
    const userType = localStorage.getItem('userType');

    // If accessToken exists, redirect to the correct dashboard
    if (accessToken) {
        if (userType === '0') {
            // Redirect to seller dashboard if the user is a seller
            const sellerId = localStorage.getItem('sellerId');
            return <Navigate to={`/dashboard/seller/${sellerId}`} />;
        } else if (userType === '1') {
            // Redirect to customer dashboard if the user is a customer
            return <Navigate to="/dashboard/customer" />;
        }
    }

    // If not authenticated, render the public route (login or register)
    return element;
};

export default PublicRoute;
