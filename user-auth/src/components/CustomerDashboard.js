import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        if (userType !== '1') {  // If user is not a customer, redirect to seller dashboard
            navigate('/dashboard/seller');
        } else {
            setLoading(false);  // Load the customer dashboard
        }
    }, [navigate]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Customer Dashboard</h2>
            <p>You have access to this route!</p>
        </div>
    );
};

export default CustomerDashboard;
