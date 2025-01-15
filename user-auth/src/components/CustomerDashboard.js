import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [cartMessage, setCartMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userType = localStorage.getItem('userType');
        if (userType !== '1') {
            navigate('/dashboard/seller');
        } else {
            fetchProducts();
        }
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:4000/api/customer/products', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(response.data.products);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('There was an error fetching products. Please try again later.');
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(
                'http://localhost:4000/api/customer/cart',
                { productId, quantity: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setCartMessage(response.data.message || 'Product added to cart successfully!');
            setTimeout(() => setCartMessage(null), 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setCartMessage('Failed to add product to cart. Please try again.');
            setTimeout(() => setCartMessage(null), 3000);
        }
    };

    const viewCart = () => {
        navigate('/customer/cart');
    };

    const viewOrderHistory = () => {
        navigate('/customer/order-history');
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
            {cartMessage && <div className="cart-message">{cartMessage}</div>}
            <button onClick={viewCart} className="view-cart-button">
                View Cart
            </button>
            <button onClick={viewOrderHistory} className="view-order-history-button">
                View Order History
            </button>
            <div className="product-container">
                {products.length === 0 ? (
                    <p>No products available</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            <img
                                src={`http://localhost:4000${product.image || '/media/default.png'}`}
                                alt={product.name}
                                className="product-image"
                            />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                className="add-to-cart-button"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))
                )}
            </div>

            <style jsx="true">{`
                .cart-message {
                    margin-bottom: 20px;
                    color: green;
                    font-weight: bold;
                }

                .view-cart-button,
                .view-order-history-button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-bottom: 20px;
                    margin-right: 10px;
                }

                .view-cart-button:hover,
                .view-order-history-button:hover {
                    background-color: #0056b3;
                }

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

                .add-to-cart-button {
                    background-color: #28a745;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                }

                .add-to-cart-button:hover {
                    background-color: #218838;
                }
            `}</style>
        </div>
    );
};

export default CustomerDashboard;
