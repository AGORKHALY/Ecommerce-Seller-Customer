import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
    const [userType, setUserType] = useState(1); // Default is customer (1)
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigate function

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        // Check if passwords match
        if (password !== confirmPassword) {
            const errorMessage = 'Passwords do not match';
            setError(errorMessage);
            toast.error(errorMessage, {
                position: 'top-center',
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/api/users/register', {
                username,
                password,
                userType,
            });

            if (response.data.accessToken) {
                // Successful registration, store the tokens
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);

                // Success notification
                toast.success('Registration successful! Redirecting to dashboard...', {
                    position: 'top-center',
                });

                // Redirect to dashboard
                setTimeout(() => navigate('/dashboard'), 2000); // Delay navigation to show the toast
            } else {
                // Show an error notification
                toast.error('Registration failed', {
                    position: 'top-center',
                });
            }
        } catch (err) {
            console.error(err);

            // Extract error message from the response or use a fallback message
            const errorMessage = err.response?.data?.error || 'An error occurred. Please try again.';

            // Show an error notification
            toast.error(errorMessage, {
                position: 'top-center',
            });
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formWrapper}>
                <h2 style={styles.heading}>Register</h2>
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
                    <div style={styles.inputGroup}>
                        <label htmlFor="confirmPassword" style={styles.label}>Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="userType" style={styles.label}>User Type:</label>
                        <select
                            id="userType"
                            value={userType}
                            onChange={(e) => setUserType(Number(e.target.value))}
                            style={styles.select}
                        >
                            <option value={1}>Customer</option>
                            <option value={0}>Seller</option>
                        </select>
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" style={styles.button}>Register</button>
                </form>
                <p style={styles.linkText}>
                    Already have an account?{' '}
                    <span
                        style={styles.link}
                        onClick={() => navigate('/login')} // Navigate to Login
                    >
                        Click here
                    </span>
                </p>
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

// Styles object remains unchanged
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
    select: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    error: {
        color: 'red',
        marginBottom: '15px',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
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

export default Register;
