import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { toast, ToastContainer } from 'react-toastify'; // Importing react-toastify for notifications
import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the styles

const CustomerCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Use useNavigate for navigation

    useEffect(() => {
        fetchCartItems();
    }, []);

    // Fetch cart items from the server
    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                setError('No authorization token found. Please log in.');
                setCartItems([]);
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:4000/api/customer/cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && Array.isArray(response.data.cart)) {
                setCartItems(response.data.cart); // Update cartItems with the data from the server
            } else {
                setError('Cart not found or invalid response structure.');
                setCartItems([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            setError('Failed to fetch cart items. Please try again later.');
            setCartItems([]);
            setLoading(false);
        }
    };

    // Handle item deletion from the cart
    const handleDelete = async (cartItemId) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.delete('http://localhost:4000/api/customer/cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: { cartItemId },
            });

            toast.success(response.data.message || 'Item removed from cart successfully!');
            fetchCartItems(); // Refresh cart data after item deletion
        } catch (error) {
            console.error('Error deleting from cart:', error);
            toast.error('Failed to remove product from cart. Please try again.');
        }
    };

    // Handle editing the quantity in the cart (increase or decrease)
    const handleEditQuantity = async (cartItemId, action) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('http://localhost:4000/api/customer/cart/edit',
                { cartItemId, action },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

            toast.success(response.data.message || 'Cart updated successfully!');
            fetchCartItems(); // Refresh cart data after quantity update
        } catch (error) {
            console.error('Error editing cart:', error);
            toast.error('Failed to update quantity. Please try again.');
        }
    };

    // Handle buying items and placing the order
    const buyItems = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('http://localhost:4000/api/customer/buy', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            toast.success(response.data.message || 'Your order has been processed, thank you for buying!');

            // Redirect to dashboard after a successful purchase
            setTimeout(() => {
                navigate('/dashboard/customer'); // Use navigate to redirect
            }, 5000); // Wait 5 seconds before redirect
        } catch (error) {
            console.error('Error processing order:', error);
            toast.error('Failed to process your order. Please try again later.');
        }
    };

    // Loading state
    if (loading) {
        return <div>Loading your cart...</div>;
    }

    // Error state
    if (error) {
        return (
            <div className="error-message">
                <strong>{error}</strong>
            </div>
        );
    }

    return (
        <div>
            <h2>Your Cart</h2>
            <div className="cart-container">
                {cartItems.length === 0 ? (
                    <p>Your cart is currently empty. Add some items to get started!</p>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.cartItemId} className="product-card">
                            <img
                                src={`http://localhost:4000${item.image || '/media/default.png'}`}
                                alt={item.name}
                                className="product-image"
                            />
                            <h3>{item.name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price}</p>
                            <p>Total: ${(item.quantity * item.price).toFixed(2)}</p>

                            <div className="quantity-controls">
                                <button
                                    onClick={() => handleEditQuantity(item.cartItemId, 'decrease')}
                                    className="quantity-button"
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => handleEditQuantity(item.cartItemId, 'increase')}
                                    className="quantity-button"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => handleDelete(item.cartItemId)}
                                className="remove-from-cart-button"
                            >
                                Remove from Cart
                            </button>
                        </div>
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <button onClick={buyItems} className="buy-items-button">
                    Buy Items
                </button>
            )}

            <ToastContainer /> {/* Added here for notifications */}

            <style jsx="true">{`
                .cart-container {
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

                .quantity-controls {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 10px;
                }

                .quantity-button {
                    background-color: #f8f9fa;
                    color: #333;
                    border: 1px solid #ccc;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 18px;
                }

                .quantity-button:disabled {
                    background-color: #e9ecef;
                    cursor: not-allowed;
                }

                .remove-from-cart-button {
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                }

                .remove-from-cart-button:hover {
                    background-color: #c82333;
                }

                .buy-items-button {
                    background-color: #28a745;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;
                }

                .buy-items-button:hover {
                    background-color: #218838;
                }

                .error-message {
                    color: red;
                    font-weight: bold;
                    margin-top: 20px;
                }
            `}</style>
        </div>
    );
};

export default CustomerCart;
