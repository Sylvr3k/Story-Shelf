import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    date: '',
    address: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    confirmpassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split("T")[0];

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'phone') {
      value = value.replace(/[^0-9]/g, ''); // Only digits for phone
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function is18OrOlder(dateString) {
    if (!dateString) return false;
    const today = new Date();
    const dob = new Date(dateString);
    if (isNaN(dob)) return false;

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age >= 18;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit handler triggered");

    setErrorMessage('');

    if (!is18OrOlder(formData.date)) {
      setErrorMessage("You must be at least 18 years old to register.");
      return;
    }

    if (formData.password !== formData.confirmpassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5009/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('User registered successfully');
        navigate('/');
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          setErrorMessage(errorData.error || "Email already in use.");
        } else {
          setErrorMessage(errorData.error || "Failed to register user.");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("An error occurred. Please try again.");
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
            <input
              type="text"
              name="firstname"
              className="form-control"
              id="firstname"
              placeholder="First Name"
              required
              value={formData.firstname}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastname"
              className="form-control"
              id="lastname"
              placeholder="Last Name"
              required
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="UserClass">
            <input
              type="text"
              required
              name="username"
              className="form-control"
              id="exampleInputUserName"
              placeholder="Enter User Name"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <input
            type="email"
            required
            name="email"
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="PhoneClass">
            <input
              id="phonetwo"
              type="text"
              name="phone"
              placeholder="Phone Number"
              maxLength="13"
              className="form-control"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <select
            className="form-control"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Your Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="date">
          <input
            type="date"
            required
            name="date"
            placeholder="Select date of birth"
            className="dateGo"
            id="dateExample"
            max={maxDateString}
            value={formData.date}
            onChange={handleChange}
          />
          <input
            type="text"
            required
            name="address"
            className="form-control"
            id="addressname"
            aria-describedby="adresshelp"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="EmandPas password-group">
          <input
            type={showPassword ? "text" : "password"}
            required
            name="password"
            className="form-control"
            id="exampleInputPassword"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type={showPassword ? "text" : "password"}
            required
            name="confirmpassword"
            className="form-control"
            id="exampleInputConfirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmpassword}
            onChange={handleChange}
          />
          <button
            type="button"
            className="password-toggle3"
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

        <div className="Jaype">
          {errorMessage && <p id="jaypara">{errorMessage}</p>}
        </div>

        <div className="Inline">
          <button type="submit">Sign Up</button>
          <p id="btnext3">
            Already have an Account? <Link to="/">Log In</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
