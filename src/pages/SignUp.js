import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        gender: '',
        date: '',
        address: '',
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5009/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('User registered successfully');
                setErrorMessage('');
                navigate('/');
            } else {
                const errorData = await response.json();
                console.error('Failed to register user', errorData);
                setErrorMessage("Failed to register user.");
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage("The Email you've Entered Is Already In Use.");
        }
    };

    return (
        <div className="OuterForm">
            <form className="FormSign" onSubmit={handleSubmit}>
                <div className="Picon">
                    <h2>Register to StoryShelf</h2>
                </div>
                <div className="Inline">
                    <div className="form-group">
                        <input type="text" name="firstname" className="form-control" id="firstname" placeholder="First Name" required value={formData.firstname} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <input type="text" name="lastname" className="form-control" id="lastname" placeholder="Last Name" required value={formData.lastname} onChange={handleChange}/>
                    </div>
                </div>
                <div className="form-group">
                    <select className="form-control" name="gender" required value={formData.gender} onChange={handleChange}>
                        <option value="" disabled>
                            Select Your Gender
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className="date">
                    <input type="date" required name="date" className="dateGo" id="dateExample" value={formData.date} onChange={handleChange}/>
                    <input type="text" required name="address" className="form-control" id="addressname" aria-describedby="adresshelp" placeholder="Address" value={formData.address} onChange={handleChange}/>
                </div>
                <div className="EmandPas">
                    <input type="email" required name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={formData.email} onChange={handleChange}/>
                    <input type="password" required name="password" className="form-control" id="exampleInputPassword" placeholder="Password" value={formData.password} onChange={handleChange}/>
                </div>
                <div className="Jaype">
                    {errorMessage && <p id="jaypara">{errorMessage}</p>}
                </div>
                <div className="Inline">
                    <button type="submit">Sign Up</button>
                    <p id="btnext3">
                        Already have an Account? <Link to="/" activeClassName="active">Log In</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Signup;