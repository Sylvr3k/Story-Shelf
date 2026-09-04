import React, { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

function LogIn() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
                <div className="form-group password-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                    >
                        {showPassword ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                </div>
                <p id="forgotpass">
                    <Link to="/ForgotPassword">Forgot Password?</Link>
                </p>
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