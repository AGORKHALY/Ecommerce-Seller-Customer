import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Updated import

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState(1); // Default is customer (1)
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Updated usage of useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/users/register', {
                username,
                password,
                userType,
            });
            console.log(response);
            if (response.data.success) {
                // Store token and redirect to dashboard
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');  // Updated from history.push to navigate
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="userType">User Type:</label>
                    <select
                        id="userType"
                        value={userType}
                        onChange={(e) => setUserType(Number(e.target.value))}
                    >
                        <option value={1}>Customer</option>
                        <option value={0}>Seller</option>
                    </select>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
