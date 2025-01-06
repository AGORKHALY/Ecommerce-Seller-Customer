import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('accessToken'); // Get token from localStorage

            if (!token) {
                setError('No token found');
                return;
            }

            try {
                const response = await axios.get('http://localhost:4000/api/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });

                setDashboardData(response.data); // Set the dashboard data from the response
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching dashboard data');
            }
        };

        fetchDashboardData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <p>{dashboardData.message}</p>
            {/* Display other dashboard details here */}
        </div>
    );
};

export default Dashboard;
