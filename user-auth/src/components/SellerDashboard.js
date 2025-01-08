import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        if (userType !== '0') {  // If user is not a seller, redirect to customer dashboard
            navigate('/dashboard/customer');
        } else {
            setLoading(false);  // Load the seller dashboard
        }
    }, [navigate]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Seller Dashboard</h2>
            <p>You have access to this route!</p>
        </div>
    );
};

export default SellerDashboard;
