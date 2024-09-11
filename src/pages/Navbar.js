import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import defaultProfilePic from './defaultProfilePic.jpg';

function Navbar() {
  const { user } = useContext(UserContext);
  const [preview, setPreview] = useState(null);

  return (
    // The Beginning of the nav-bar
    <nav className="navbar navbar-expand-sm navbar-light" id="navbar">
      <div className="container d-flex">
        <Link to="/Home" className="S-Icon navbar-brand">
          <img src="letter-s lighter1.png" height="30px" width="30px" alt="Logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="bashThree nav-item">
              <Link to="/Home" className="nav-link mx-2" activeClassName="active">
                Home
              </Link>
            </li>
            <li className="bashTwo nav-item">
              <Link to="/Cart" className="nav-link mx-2" activeClassName="active">
                Cart
              </Link>
            </li>
            <li className="bashOne nav-item">
              <Link to="/Shop" className="nav-link mx-2" activeClassName="active">
                Shop
              </Link>
            </li>
            {user && (
              <li className="bash nav-item d-flex align-items-center">
                <Link to="/Profile" className="nav-link mx-2" activeClassName="active">
                  <img src={user.profilePicture ? `data:image/jpg;base64,${user.profilePicture}` : preview || defaultProfilePic} alt="Profile" className="rounded-circle me-2" style={{ height: '50px', width: '50px', objectFit: 'cover' }}/>
                  {user. firstname}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
    // The end of the nav-bar
  );
}

export default Navbar;