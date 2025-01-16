import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Importing react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

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
            toast.success('Product added to cart successfully!'); // Show success toast
            setTimeout(() => setCartMessage(null), 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setCartMessage('Failed to add product to cart. Please try again.');
            toast.error('Failed to add product to cart. Please try again.'); // Show error toast
            setTimeout(() => setCartMessage(null), 3000);
        }
    };

    const viewCart = () => {
        navigate('/customer/cart');
    };

    const viewOrderHistory = () => {
        navigate('/customer/order-history');
    };

    const logoutUser = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');  // Get refresh token from storage
            if (!refreshToken) {
                console.log("No refresh token found");
                return;
            }

            // Make the API call to logout the user
            const response = await axios.post(
                'http://localhost:4000/api/users/logout',
                { refreshToken },  // Pass the refresh token in the body
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Check if logout was successful by validating the backend response
            if (response.data.message === "User logged out successfully") {
                console.log("Logout success:", response.data);

                // Clear local storage after successful logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                // Show success toast
                toast.success('Logged out successfully!');

                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    navigate('/login');  // Use navigate from react-router-dom
                }, 2000);
            } else {
                console.log("Unexpected response:", response.data);
                toast.error('Unexpected response during logout!');
            }
        } catch (error) {
            console.error("Error logging out:", error.response?.data || error.message);
            toast.error('Error logging out. Please try again.');
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
            {cartMessage && <div className="cart-message">{cartMessage}</div>}
            <button onClick={viewCart} className="view-cart-button">
                View Cart
            </button>
            <button onClick={viewOrderHistory} className="view-order-history-button">
                View Order History
            </button>
            <button onClick={logoutUser} className="logout-button">
                Logout
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

            {/* Add the ToastContainer to show the toasts */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

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

                .logout-button {
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;
                }

                .logout-button:hover {
                    background-color: #c82333;
                }
            `}</style>
        </div>
    );
};

export default CustomerDashboard;
