import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function DashboardBooks() {

    // Gets token from localStorage
    const token = localStorage.getItem("token");

    // Decode token 
    let currentUser = null;
    if (token) {
      try {
        currentUser = jwtDecode(token);  // returns an object with _id, email, etc.
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }

  const [book, setBook] = useState({ title: "", para: "", category:"", price: "", pic: "" });
  const [books, setBooks] = useState([]);

  // Load books from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const decoded = jwtDecode(token);
      const userId = decoded._id;
  
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
  
    } catch (err) {
      console.error("Invalid token:", err);
    }
  
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !currentUser._id) {
      alert("You must be logged in to post a book!");
      return;
    }

    if (!book.title || !book.price || !book.category) {
      alert("Title, category, and price are required.");
      return;
    }
  
    const bookToSend = {
      title: book.title,
      para: book.para,
      category: book.category,
      pic: book.pic,
      price: Number(book.price),
      sellerId: currentUser._id,
      sellerEmail: currentUser.email,
      sellerName: currentUser.name
    };
  
    console.log("Sending book:", bookToSend);
  
    try {
      const res = await fetch("http://localhost:5009/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookToSend)
      });
  
      if (res.ok) {
        
      }

      if (!res.ok) {
        const err = await res.json();
        console.error("Server error:", err);
        alert("Failed to add book");
        return;
      } else {
        alert("Book Added");
      }
  
      const newBook = await res.json();
  
      setBooks((prev) => [...prev, newBook]);
  
      setBook({
        title: "",
        para: "",
        category: "",
        price: "",
        pic: ""
      });
  
    } catch (err) {
      console.error("Network error:", err);
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

        <div className="GrandDaughter">
          <div className="BookForm">
            <div className="bg-white p-8 rounded-2xl shadow-md mb-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Book Title" value={book.title}
                  onChange={(e) => setBook({ ...book, title: e.target.value })} className="w-full border rounded-xl px-4 py-2" /><br/>
                <textarea placeholder="Description" value={book.para}
                  onChange={(e) => setBook({ ...book, para: e.target.value })} className="w-full border rounded-xl px-4 py-2" /><br/>
                <input type="text" placeholder="Category" value={book.category}
                  onChange={(e) => setBook({ ...book, category: e.target.value })} className="w-full border rounded-xl px-4 py-2" /><br/>  
                <input type="number" placeholder="Price" value={book.price}
                  onChange={(e) => setBook({ ...book, price: e.target.value })} className="w-full border rounded-xl px-4 py-2" /><br/>
                <input type="text" placeholder="Image URL" value={book.pic}
                  onChange={(e) => setBook({ ...book, pic: e.target.value })} className="w-full border rounded-xl px-4 py-2" /><br/>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700">
                  Post Book
                </button>
              </form>
            </div>
            
            <div class="Preview">
                {books.length === 0 ? (
                  <p></p>
                ) : (
                 <ul>
                  {books.map((book) => (
                    <li key={book._id}>
                      <div className="card" style={{width: '5rem'}}>
                          <img className="card-img-top" src={book.pic} alt="Card image cap"/>
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

export default DashboardBooks;
