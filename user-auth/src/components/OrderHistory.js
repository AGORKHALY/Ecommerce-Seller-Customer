import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const fetchOrderHistory = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:4000/api/customer/orders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data.orders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching order history:', error);
            setError('Failed to fetch order history. Please try again later.');
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading order history...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <h3>Order ID: {order.id}</h3>
                        <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <h4>Items:</h4>
                        <ul>
                            {order.items.map((item) => (
                                <li key={item.id}>
                                    {item.product.name} - Quantity: {item.quantity} - Price: $
                                    {(item.quantity * item.product.price).toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistory;
