

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post('/auth/login', {
                email,
                password
            });

            console.log(response.data);

            // Save user information
            const user = response.data.user;
            localStorage.setItem('user', JSON.stringify(user));

            alert('Login successful!');

            // Navigate to dashboard
            navigate('/dashboard');

        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div>
            <h1>Student Management Login</h1>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <br /><br />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
