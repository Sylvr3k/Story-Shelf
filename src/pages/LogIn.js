import React, { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

function LogIn() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5009/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('User logged in successfully', data);
                setErrorMessage('');
                setUser(data);  // Set user data in context
                localStorage.setItem('token', data.token); // Store token in localStorage
                navigate('/home');
            } else {
                const errorData = await response.json();
                console.error('Failed to log in.', errorData);
                setErrorMessage(errorData.message || 'Failed to log in.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="OuterForm2">
            <form className="FormLog" onSubmit={handleSubmit}>
                <div className="Picon">
                    <h2>Welcome to StoryShelf</h2>
                </div>
                <div className="form-group">
                    <input type="email" required name="email" className="form-control" placeholder="Enter email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="password" required name="password" className="form-control" placeholder="Password" value={formData.password} onChange={handleChange} />
                </div>
                <div className="Jaype">
                    <p id="jaypara">{errorMessage}</p>
                </div>
                <div className="Inline">
                    <button type="submit">Log In</button>
                    <p id="btnext3">Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
            </form>
        </div>
    );
}

export default LogIn;