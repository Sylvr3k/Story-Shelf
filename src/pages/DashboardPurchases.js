import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function DashboardPurchases() {
  const [purchases, setPurchases] = useState([]);

  const token = localStorage.getItem("token");

  let currentUser = null;
  try {
    const decoded = token ? jwtDecode(token) : null;
    currentUser = decoded
      ? {
          id: decoded.id || decoded._id || decoded.userId,
          email: decoded.email,
        }
      : null;
  } catch (err) {
    console.error("Invalid token");
  }

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchPurchases = async () => {
      try {
        const response = await fetch(
          `http://localhost:5009/orders/purchases/${currentUser.id}`
        );

        const data = await response.json();
        console.log("Purchases response:", data);

        if (!response.ok) {
          console.error("Backend error:", data);
          setPurchases([]);
          return;
        }

        setPurchases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch sales:", err);
        setPurchases([]);
      }
    };

    fetchPurchases();
  }, [currentUser?.id]);

  return (
    <>
      <div className="KO">
        <div className="Mother">
          <div className="Sidebar">
            <h2 className="dashboard-title">
              <font style={{color: '#eef0bb'}}>A</font>
              <font style={{color: '#fbebc1'}}>d</font>
              <font style={{color: '#bcdef4'}}>m</font>
              <font style={{color: '#e4c8e0'}}>i</font>
              <font style={{color: '#fac7c7'}}>n</font> Hub
            </h2>
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

        <div className="Daughter">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Seller Name</th>
                <th className="p-3">Seller Email</th>
                <th className="p-3">Book</th>
                <th className="p-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">

                   <div className="HeadMost">
                     <h1>No Purchases!</h1>
                   </div>

                  </td>
                </tr>
                ) : (
                  purchases.map((purchase) => (
                    <tr key={purchase._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{purchase.sellerName}</td>
                      <td className="p-3 text-gray-600">{purchase.sellerEmail}</td>
                      <td className="p-3 text-gray-600">{purchase.title}</td>
                      <td className="p-3 font-semibold text-indigo-600">
                        ${purchase.price}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default DashboardPurchases;