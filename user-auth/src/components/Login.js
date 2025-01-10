import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f4f4f4',
        },
        formWrapper: {
            width: '300px',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        heading: {
            textAlign: 'center',
            marginBottom: '20px',
        },
        inputGroup: {
            marginBottom: '15px',
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
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
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
        },
        buttonHover: {
            backgroundColor: '#45a049',
        },
        error: {
            color: 'red',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '10px',
        },
        linkText: {
            textAlign: 'center',
            marginTop: '15px',
        },
        link: {
            color: '#007bff',
            cursor: 'pointer',
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:4000/api/users/login', {
                username,
                password,
            });

            if (response.data.accessToken) {
                const { accessToken, refreshToken, user } = response.data;

                // Store tokens and userType
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('userType', user.userType);

                toast.success('Login successful! Redirecting...', {
                    position: 'top-center',
                });

                setTimeout(() => {
                    const sellerId = response.data.user.userTypeId;
                    if (user.userType === 0) {
                        // Navigate to the seller's dashboard using the sellerId
                        navigate(`/dashboard/seller/${sellerId}`);
                    } else {
                        navigate('/dashboard/customer');
                    }
                }, 2000);
            } else {
                toast.error('Invalid credentials. Please try again.', {
                    position: 'top-center',
                });
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred. Please try again.', {
                position: 'top-center',
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
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                <p style={styles.linkText}>
                    Don't have an account?{' '}
                    <span
                        style={styles.link}
                        onClick={() => navigate('/register')}
                    >
                        Register here
                    </span>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
