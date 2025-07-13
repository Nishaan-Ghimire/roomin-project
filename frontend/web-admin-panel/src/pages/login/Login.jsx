import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './login.scss'; // Ensure this CSS file is created
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for redirection

    useEffect(() => {
        // Check if user is already logged in
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          navigate('/dashboard');
        }
      }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('https://stingray-app-ye7j7.ondigitalocean.app/v1/admin/login', { email, password });
            
            // Assuming response contains tokens and other user data
            const { accessToken, refreshToken } = response.data.data;
            
            // Set tokens in cookies
            document.cookie = `accessToken=${accessToken}; path=/; secure; HttpOnly`;
            document.cookie = `refreshToken=${refreshToken}; path=/; secure; HttpOnly`;
            // Set tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
                        // Redirect to dashboard
                        navigate('/dashboard');

            // Handle successful login, e.g., redirect or show a success message
            // console.log('Login successful:', response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="loginPage">
            <h1>Admin Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="password">Password:</label>
                    <div className="passwordContainer">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="button" className="togglePassword" onClick={togglePasswordVisibility}>
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
