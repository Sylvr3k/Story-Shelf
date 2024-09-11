import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { UserContext } from "./UserContext";

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    date: '',
    address: '',
    profilePicture: null,
  });

  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:5009/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstname: data.firstname || '',
            lastname: data.lastname || '',
            gender: data.gender || '',
            date: data.date ? data.date.split('T')[0] : '',
            address: data.address || '',
            profilePicture: data.profilePicture || null,
          });
          setPreview(data.profilePicture ? `data:image/png;base64,${data.profilePicture}` : null);
          setUser(data); // Update user context
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to fetch user details.');
        }
      } catch (error) {
        setErrorMessage(error.message || 'Error fetching user details.');
      }
    };

    fetchUserDetails();
  }, [setUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        profilePicture: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();
      for (const key in formData) {
        if (key === 'profilePicture' && formData[key]) {
          formDataToSubmit.append(key, formData[key], formData[key].name);
        } else {
          formDataToSubmit.append(key, formData[key]);
        }
      }

      const response = await fetch('http://localhost:5009/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSubmit,
      });

      if (response.ok) {
        const data = await response.json();
        setErrorMessage('');
        setUser(data); // Update user context
        navigate('/Home');
      } else {
        const errorData = await response.json();
        setErrorMessage('Failed to update profile.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <div className="Profile">
        <form className="FormProfile" onSubmit={handleSubmit}>
          <div className="profile-picture-upload">
            <div className="profile-picture-preview">
              {preview ? (
                <img src={preview} alt="Profile Preview" />
              ) : (
                <div className="placeholder">No Image</div>
              )}
            </div>
            <div className="upload-container">
              <input type="file" id="file-input" onChange={handlePictureUpload} />
              <label htmlFor="file-input">
                {formData.profilePicture ? "Change Photo" : "Add Photo"}
              </label>
            </div>
          </div>
           <div className="HWT">
              <div className="Inline">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstname" className="form-control" id="firstname" placeholder="First Name" required value={formData.firstname} onChange={handleChange}/>
                  </div>
                  <div className="form-group">
                  <label>Last Name</label>
                    <input type="text" name="lastname" className="form-control" id="lastname" placeholder="Last Name" required value={formData.lastname} onChange={handleChange}/>
                  </div>
              </div>
              <div className="form-group">
                <label>Select Your Gender</label>
                <select className="form-control" name="gender" required value={formData.gender} onChange={handleChange}>
                  <option value="" disabled>
                    Select Your Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="date">
               <div className="birth">
                <label>Birth Date</label>
                <input type="date" required name="date" className="dateGo" id="dateExample" value={formData.date} onChange={handleChange}/>
               </div>
               <div className="Add">
                <label>Address</label>
                <input type="text" required name="address" className="form-control" id="addressname" aria-describedby="adresshelp" placeholder="Address" value={formData.address} onChange={handleChange}/>
               </div>
              </div>
              <div className="Bear">
                <div className="BearH">    
                  {errorMessage && <p id="jaypara">{errorMessage}</p>}
                </div>
                <button type="submit">Save</button>
              </div>
           </div>
         </form>
      </div>
      <Footer />
    </>
  );
}

export default Profile;