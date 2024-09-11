import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return(
       <>
        <footer>
          <div class="footer-container">
              <div class="footer-about">
                  <h3>About Us</h3>
                  <p>We are a company dedicated to providing the best services in the industry. Our mission is to deliver high-quality books that bring joy to our customers.</p>
              </div>
              <div class="footer-links">
                  <h3>Quick Links</h3>
                  <ul>
                      <li><Link to="/Home#">Home</Link></li>
                      <li><Link to="/Shop#">Shop</Link></li>
                      <li><Link to="/Cart#">Cart</Link></li>
                      <li><Link to="/Profile">Profile</Link></li>
                  </ul>
              </div>
              <div class="footer-contact">
                  <h3>Contact Us</h3>
                  <p>Email: StoryShelf@gmail.com</p>
                  <p>Phone: +255 671 789 890</p>
                  <p>Address: 45 Brooklyn Street, Dar Es Salaam, Tanzania</p>
              </div>
              <div class="footer-social">
                  <h3>Follow Us</h3>
                <div className="Icons">  
                  <Link target="_blank" to="https://www.instagram.com/_sylvr3k/?hl=en"><i className="bi bi-instagram"></i></Link>
                  <Link target="_blank" to="https://www.threads.com"><i className="bi bi-threads"></i></Link>
                  <Link target="_blank" to="https://www.twitter.com"><i class="bi bi-twitter-x"></i></Link>
                  <Link target="_blank" to="https://www.whatsapp.com"><i class="bi bi-whatsapp"></i></Link>
                  <Link target="_blank" to="https://www.facebook.com"><i className="bi bi-facebook"></i></Link>
                </div>
              </div>
          </div>
          <div class="footer-bottom">
              <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
      </footer>

      <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>  
        </>
    )
}
export default Footer;

