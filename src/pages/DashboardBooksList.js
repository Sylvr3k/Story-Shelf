import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { NavLink } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function DashboardBooksList({ currentUser }) {

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    let userId;
    if (currentUser?._id) {
      userId = currentUser._id;
    } else {
      // Decodes token locally
      const decoded = jwtDecode(token);
      userId = decoded._id;
    }
  
    fetch(`http://localhost:5009/books/seller/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("BOOKS DATA:", data);
      
        if (Array.isArray(data)) {
          setBooks(data);
        } else if (Array.isArray(data.books)) {
          setBooks(data.books);
        } else {
          setBooks([]);
        }
      })
      .catch(err => console.error("Error fetching books:", err));
  
  }, [currentUser]);

  const handleDelete = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:5009/books/${bookId}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        // removes deleted book from state
        setBooks(books.filter((book) => book._id !== bookId));
      } else {
        console.error("Failed to delete book");
      }
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <>
      <div className="KO">
      <div className="Mother">

          <div className="Sidebar">
          <h2 className="dashboard-title"><font style={{color: '#eef0bb' }}>A</font><font style={{color: '#fbebc1' }}>d</font><font style={{color: '#bcdef4'}}>m</font><font style={{color: '#e4c8e0'}}>i</font><font style={{color: '#fac7c7'}}>n</font> Hub</h2>
            <NavLink id="places" to="/AdminHub" className={({ isActive }) => isActive ? "nav-links active" : "nav-links"}
            >
              Dashboard
            </NavLink>
            <NavLink id="places" to="/DashboardBooks" className={({ isActive }) => isActive ? "nav-links active" : "nav-links"}
            >
              Add Books
            </NavLink>
            <NavLink id="places" to="/DashboardBooksList" className={({ isActive }) => isActive ? "nav-links active" : "nav-links"}
            >
              My Listings
            </NavLink>
            <NavLink id="places" to="/DashboardPurchases" className={({ isActive }) => isActive ? "nav-links active" : "nav-links"}
            >
              Purchases
            </NavLink>
            <NavLink id="places" to="/DashboardSales" className={({ isActive }) => isActive ? "nav-links active" : "nav-links"}
            >
              Sales
            </NavLink>
            <NavLink id="home" to="/Home" className="nav-link return-main">
              Return to Main Site
            </NavLink>
            <NavLink id="hometo" to="/" className="nav-link return-main">
              Log Out
            </NavLink>
            </div>
 </div>

        <div className="StepDaughter">
          <div className="MaxCollection">
            {/* Books Collection */}
            <div>
                {books.length === 0 ? (
                   <div className="HeadMo">
                     <h1>No Books!</h1>
                   </div>
                ) : (
                 <ul>
                  {books.map((book) => (
                    <li key={book._id}>
                   
                      <div className="card" style={{width: '18rem'}}>
                          <img className="card-img-top" src={book.pic} alt="Card image cap"/>
                          <div className="card-body">
                            <h5 className="card-title">{book.title}</h5>
                            <p className="card-text">{book.para}</p>
                            <p className="card-mash">{book.price} USD</p>
                            <button className="card-btn-del" onClick={() => handleDelete(book._id)}>
                               Delete
                            </button>

                          </div>
                      </div>

                    </li>
                  ))}
                </ul>
                )}
              </div>
          </div>
        </div> 
      </div>
    </>
  );
}

export default DashboardBooksList;
