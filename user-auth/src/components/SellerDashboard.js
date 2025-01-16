import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SellerDashboard = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Store the sellerId in localStorage
    useEffect(() => {
        if (sellerId) {
            localStorage.setItem('sellerId', sellerId); // Storing sellerId in local storage
        }
    }, [sellerId]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            if (!sellerId) {
                throw new Error('Seller ID not found');
            }

            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(
                `http://localhost:4000/api/seller/products/${sellerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message || 'Error fetching products');
            toast.error('Failed to fetch products. Please try again!');
        } finally {
            setLoading(false);
        }
    }, [sellerId]);

    useEffect(() => {
        fetchProducts();
    }, [sellerId, fetchProducts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedProduct?.name || !selectedProduct?.price || !selectedProduct?.description) {
            setError('All fields are required!');
            toast.error('All fields are required!');
            return;
        }

        const price = Number(selectedProduct.price);
        if (isNaN(price)) {
            setError('Please enter a valid price.');
            toast.error('Please enter a valid price!');
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Authentication token not found!");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", selectedProduct.name);
            formData.append("description", selectedProduct.description);
            formData.append("price", price);

            if (selectedProduct.image && selectedProduct.image instanceof File) {
                formData.append("image", selectedProduct.image);
            }

            if (selectedProduct?.id) {
                if (price) {
                    await axios.put(
                        "http://localhost:4000/api/seller/set-price",
                        { productId: selectedProduct.id, newPrice: price },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                }

                if (selectedProduct.description) {
                    await axios.put(
                        "http://localhost:4000/api/seller/update-description",
                        { productId: selectedProduct.id, newDescription: selectedProduct.description },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                }

                if (selectedProduct.image && selectedProduct.image instanceof File) {
                    formData.append("productId", selectedProduct.id);
                    await axios.put(
                        "http://localhost:4000/api/seller/upload-image",
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                }

                toast.success("Product updated successfully!");
                setSelectedProduct(null);
                fetchProducts();
            } else {
                const response = await axios.post(
                    "http://localhost:4000/api/seller/add-product",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                setProducts([...products, response.data.product]);
                setSelectedProduct(null);
                toast.success("Product added successfully!");
            }
        } catch (error) {
            console.error("Error in product submission:", error);
            setError('Failed to update the product. Check the console for details.');
            toast.error('Failed to update the product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
    };

    const handleCancel = () => {
        setSelectedProduct(null);
    };

    const handleDelete = async (productId) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Authentication token not found!");
            return;
        }

        try {
            await axios.delete(`http://localhost:4000/api/seller/delete-product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(products.filter((product) => product.id !== productId));
            toast.success("Product deleted successfully!");
        } catch (error) {
            console.error("Error deleting product:", error);
            setError('Failed to delete the product. Check the console for details.');
            toast.error('Failed to delete the product. Please try again.');
        }
    };

    const logoutUser = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.log("No refresh token found");
                return;
            }

            const response = await axios.post(
                'http://localhost:4000/api/users/logout',
                { refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data.message === "User logged out successfully") {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                toast.success("Logged out successfully!");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error("Unexpected logout response.");
            }
        } catch (error) {
            console.error("Error logging out:", error.response?.data || error.message);
            toast.error("Failed to log out. Please try again.");
        }
    };

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            minHeight: '100vh',
        },
        formWrapper: {
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '600px',
            marginBottom: '20px',
        },
        input: {
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '5px',
            border: '1px solid #ddd',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        errorMessage: {
            color: 'red',
            marginTop: '10px',
        },
        productList: {
            listStyleType: 'none',
            padding: 0,
        },
        productItem: {
            margin: '10px 0',
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        }
    };

    return (
        <div style={styles.container}>
            <h2>Seller Dashboard</h2>

            <form onSubmit={handleSubmit} style={styles.formWrapper}>
                <h3>{selectedProduct?.id ? "Edit Product" : "Add Product"}</h3>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={selectedProduct?.name || ""}
                    onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, name: e.target.value })
                    }
                    required={!selectedProduct?.id}
                    style={styles.input}
                />
                <textarea
                    placeholder="Description"
                    value={selectedProduct?.description || ""}
                    onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, description: e.target.value })
                    }
                    required={!selectedProduct?.id}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={selectedProduct?.price || ""}
                    onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, price: e.target.value })
                    }
                    required={!selectedProduct?.id}
                    style={styles.input}
                />

                {selectedProduct?.image && typeof selectedProduct.image === 'string' && selectedProduct.image.startsWith("http") && (
                    <div>
                        <img
                            src={`http://localhost:4000${selectedProduct.image}`}
                            alt="Preview"
                            style={{ maxWidth: "200px", marginTop: "10px" }}
                        />
                    </div>
                )}

                <input
                    type="file"
                    onChange={(e) =>
                        setSelectedProduct({
                            ...selectedProduct,
                            image: e.target.files[0],
                        })
                    }
                    style={styles.input}
                />

                {error && <div style={styles.errorMessage}>{error}</div>}

                <button type="submit" style={styles.button}>
                    {loading ? "Loading..." : selectedProduct?.id ? "Update Product" : "Add Product"}
                </button>
                {selectedProduct?.id && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{ ...styles.button, backgroundColor: "#6c757d" }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <ul style={styles.productList}>
                {products.map((product) => (
                    <li key={product.id} style={styles.productItem}>
                        <strong>{product.name}</strong>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <button
                            onClick={() => handleEdit(product)}
                            style={{ ...styles.button, marginRight: "10px" }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(product.id)}
                            style={{ ...styles.button, backgroundColor: "red" }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <button
                onClick={logoutUser}
                style={{
                    ...styles.button,
                    backgroundColor: "red",
                    marginTop: "20px",
                }}
            >
                Logout
            </button>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default SellerDashboard;
