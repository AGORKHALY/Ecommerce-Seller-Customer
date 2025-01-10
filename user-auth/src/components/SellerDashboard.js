import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerDashboard = () => {
    const [products, setProducts] = useState([]); // List of products
    const [selectedProduct, setSelectedProduct] = useState(null); // For adding or editing
    const [error, setError] = useState(''); // Error state
    const [loading, setLoading] = useState(false); // Loading state to manage requests

    const fetchProducts = async () => {
        setLoading(true); // Set loading to true when fetching products
        try {
            const sellerId = localStorage.getItem('sellerId'); // Get the sellerId from localStorage
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

            setProducts(response.data.products); // Update the state with the fetched products
            setLoading(false); // Set loading to false after products are fetched
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error fetching products');
            setLoading(false); // Set loading to false in case of error
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error before submitting

        if (!selectedProduct?.name || !selectedProduct?.price || !selectedProduct?.description) {
            setError('All fields are required!');
            return;
        }

        const price = Number(selectedProduct.price);
        if (isNaN(price)) {
            setError('Please enter a valid price.');
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Authentication token not found");
            return;
        }

        setLoading(true); // Set loading to true during product submission

        try {
            const formData = new FormData();
            formData.append("name", selectedProduct.name);
            formData.append("description", selectedProduct.description);
            formData.append("price", price);  // Use the parsed price here

            // Log the image file to check if it's correctly appended
            if (selectedProduct.image && selectedProduct.image instanceof File) {
                console.log("Image file:", selectedProduct.image);
                formData.append("image", selectedProduct.image);
            } else if (selectedProduct.image) {
                console.log("Image is not a valid file:", selectedProduct.image);
            }

            // Check if formData is being built correctly
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            if (selectedProduct?.id) {
                // Editing an existing product
                console.log("Updating product with ID:", selectedProduct.id);

                if (price) {
                    console.log("Updating price:", price);
                    await axios.put(
                        "http://localhost:4000/api/seller/set-price",
                        { productId: selectedProduct.id, newPrice: price },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    console.log("Price updated successfully!");
                }

                if (selectedProduct.description) {
                    console.log("Updating description:", selectedProduct.description);
                    await axios.put(
                        "http://localhost:4000/api/seller/update-description",
                        { productId: selectedProduct.id, newDescription: selectedProduct.description },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    console.log("Description updated successfully!");
                }

                // Upload image
                if (selectedProduct.image && selectedProduct.image instanceof File) {
                    console.log("Uploading image...");
                    formData.append("productId", selectedProduct.id); // Add productId to the formData

                    const uploadResponse = await axios.put(
                        "http://localhost:4000/api/seller/upload-image",
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    console.log("Image uploaded successfully!", uploadResponse.data);
                }

                alert("Product updated successfully!");
                setSelectedProduct(null); // Clear the form

                // Re-fetch the products to reflect the update
                fetchProducts(); // This will refresh the product list after updating
            } else {
                // Adding a new product
                console.log("Adding new product...");

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

                console.log("Product added successfully!", response.data);
                setProducts([...products, response.data.product]); // Update product list
                setSelectedProduct(null); // Clear the form
            }
        } catch (error) {
            console.error("Error in product submission:", error);
            setError('Failed to update the product. Check the console for details.');
        } finally {
            setLoading(false); // Set loading to false after the operation is completed
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
            alert("Authentication token not found");
            return;
        }

        try {
            await axios.delete(`http://localhost:4000/api/seller/delete-product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Product deleted successfully!");
            setProducts(products.filter((product) => product.id !== productId)); // Remove the deleted product from the list
        } catch (error) {
            console.error("Error deleting product:", error);
            setError('Failed to delete the product. Check the console for details.');
        }
    };

    // Style Object
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

            {/* Product Form */}
            <form onSubmit={handleSubmit} style={styles.formWrapper}>
                <h3>{selectedProduct?.id ? "Edit Product" : "Add Product"}</h3>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={selectedProduct?.name || ""}
                    onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, name: e.target.value })
                    }
                    required={!selectedProduct?.id} // Required only for new products
                    style={styles.input}
                />
                <textarea
                    placeholder="Description"
                    value={selectedProduct?.description || ""}
                    onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, description: e.target.value })
                    }
                    required={!selectedProduct?.id} // Required only for new products
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={selectedProduct?.price || ""}
                    onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, price: e.target.value })
                    }
                    required={!selectedProduct?.id} // Required only for new products
                    style={styles.input}
                />

                {/* Display existing image if available */}
                {selectedProduct?.image && typeof selectedProduct.image === 'string' && selectedProduct.image.startsWith("http") && (
                    <div>
                        <img
                            src={`http://localhost:4000${selectedProduct.image}`}
                            alt="Product"
                            style={{ width: "100px", height: "100px" }}
                        />
                    </div>
                )}

                {/* File Input */}
                <input
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setSelectedProduct({ ...selectedProduct, image: file });
                        }
                    }}
                    style={styles.input}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Processing..." : selectedProduct?.id ? "Update Product" : "Add Product"}
                </button>
                {selectedProduct?.id && <button type="button" onClick={handleCancel} style={styles.button}>Cancel</button>}
            </form>

            {/* Error message */}
            {error && <p style={styles.errorMessage}>{error}</p>}

            {/* Product List */}
            <h3>Product List</h3>
            {products.length === 0 ? (
                <p>No products added by the seller.</p>
            ) : (
                <ul style={styles.productList}>
                    {products.map((product) => (
                        <li key={product.id} style={styles.productItem}>
                            <strong>{product.name}</strong> - ${product.price}
                            <button onClick={() => handleEdit(product)} style={styles.button}>Edit</button>
                            <button onClick={() => handleDelete(product.id)} style={styles.button}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SellerDashboard;
