import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState(1); // Default is customer
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
        select: {
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

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match', {
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
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('userType', response.data.user.userType);
                localStorage.setItem('sellerId', response.data.user.userTypeId);

                toast.success('Registration successful! Redirecting to dashboard...', {
                    position: 'top-center',
                });

                setTimeout(() => {
                    if (userType === 0) {
                        navigate('/dashboard/seller');
                    } else {
                        navigate('/dashboard/customer');
                    }
                }, 2000);
            } else {
                toast.error('Registration failed', {
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
                        onClick={() => navigate('/login')}
                    >
                        Login here
                    </span>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
