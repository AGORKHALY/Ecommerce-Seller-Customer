import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        if (userType !== '1') {  // If user is not a customer, redirect to seller dashboard
            navigate('/dashboard/seller');
        } else {
            fetchProducts();  // Fetch products when the user is a customer
        }
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:4000/api/customer/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProducts(response.data.products);
            setLoading(false);  // Set loading to false once data is fetched
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("There was an error fetching products. Please try again later.");
            setLoading(false);  // Set loading to false even if there's an error
        }
    };

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Customer Dashboard</h2>

            <div className="product-container">
                {products.length === 0 ? (
                    <p>No products available</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            <img
                                // Dynamically construct the image URL
                                src={`http://localhost:4000${product.image || '/media/default.png'}`}
                                alt={product.name}
                                className="product-image"
                            />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Inline CSS for the page */}
            <style jsx="true">{`
                .product-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: center;
                }

                .product-card {
                    width: 250px;
                    border: 1px solid #ccc;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                }

                .product-card:hover {
                    transform: scale(1.05);
                }

                .product-image {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 5px;
                }
            `}</style>
        </div>
    );
};

export default CustomerDashboard;
