import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize navigate function

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/users/login', {
                username,
                password,
            });

            if (response.data.accessToken) {
                // Store the access token and refresh token in localStorage
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);

                // Show a success notification
                toast.success('Login successful! Redirecting to dashboard...', {
                    position: 'top-center', // Updated to string value
                });

                // Redirect to dashboard
                setTimeout(() => navigate('/dashboard'), 2000); // Delay navigation to show the toast
            } else {
                // Show an error notification
                toast.error('Login failed', {
                    position: 'top-center', // Updated to string value
                });
            }
        } catch (err) {
            console.error(err);

            // Extract error message from the response or use a fallback message
            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';

            // Show an error notification
            toast.error(errorMessage, {
                position: 'top-center', // Updated to string value
            });
        }
    };


    return (
        <div style={styles.container}>
            <div style={styles.formWrapper}>
                <h2 style={styles.heading}>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="username" style={styles.label}>Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                <p style={styles.linkText}>
                    Don't have an account?{' '}
                    <span
                        style={styles.link}
                        onClick={() => navigate('/register')} // Navigate to Register
                    >
                        Create a new account, here
                    </span>
                </p>
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
    },
    formWrapper: {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        width: '350px',
        textAlign: 'center',
    },
    heading: {
        marginBottom: '20px',
        color: '#333',
    },
    inputGroup: {
        marginBottom: '15px',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    linkText: {
        marginTop: '15px',
        color: '#555',
    },
    link: {
        color: '#007bff',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
};

export default Login;
