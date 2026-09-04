import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

let userId = null;

if (token) {
  try {
    const decoded = jwtDecode(token);
    userId = decoded._id;
  } catch (err) {
    console.error("Invalid token:", err);
  }
}

function AdminHub() {
  const [sales, setSales] = useState([]);
  const [chartData, setChartData] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSales = async () => {
      try {
        if (!userId) {
          console.error("No userId found");
          return;
        }
  
        const res = await fetch(
          `http://localhost:5009/orders/sales/${userId}`
        );
  
        const data = await res.json();
        setSales(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };
  
    fetchSales();
  }, [userId]);

  const totalRevenue = sales.reduce(
    (acc, sale) => acc + Number(sale.price || 0),
    0
  );

  return (
    <>
      <div className="KO">
      {/* Navigational sidebar */}
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
            <NavLink
              id="hometo"
              to="/"
              className="nav-link return-main"
              onClick={() => {
                localStorage.removeItem("token");  // remove token
                localStorage.removeItem("user");   // optional if you stored user separately
              }}
            >
              Log Out
            </NavLink>
            </div>
          </div>
                {/* Overview stats */}
        <div className="Daughter">
          <div className="Convertible">
          <div className="Vertible">

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="stat-card">
                <div>
                  <p className="stat-label">Total Sales</p>
                  <h3 className="stat-value">{sales.length}</h3>
                </div>
              </div>

              <div className="stat-card">
                <div>
                  <p className="stat-label">Revenue</p>
                  <h3 className="stat-value">
                    $
                    {sales
                      .reduce((acc, s) => acc + Number(s.price || 0), 0)
                      .toFixed(2)}
                  </h3>
                </div>
              </div>

              <div className="stat-card">
                <div>
                  <p className="stat-label">New This Week</p>
                  <h3 className="stat-value">+{sales.length}</h3>
                </div>
              </div>

            </div>

          </div>
          <div className="Con">
           {/* Graph */}
              <div className="stat-card-big mt-6 bg-white p-5 rounded-2xl shadow-md">
                <p className="stat-label font-semibold mb-3">Revenue Over Time</p>

                <ReactApexChart className="Chart"
                  type="line"
                  height={250}
                  series={[
                    {
                      name: "Revenue",
                      data: sales
                        .map((s) => ({
                          x: new Date(s.purchasedAt).toLocaleDateString(),
                          y: Number(s.price),
                        }))
                        // Optional: group by date and sum revenue if multiple sales per day
                        .reduce((acc, curr) => {
                          const existing = acc.find((a) => a.x === curr.x);
                          if (existing) existing.y += curr.y;
                          else acc.push(curr);
                          return acc;
                        }, []),
                    },
                  ]}
                  options={{
                    chart: {
                      style: {outline: "none"},
                      toolbar: { show: false },
                      zoom: { enabled: false },
                      animations: { enabled: true, easing: "easeinout", speed: 800 },
                    },
                    xaxis: {
                      type: "category",
                      labels: { rotate: -45, style: { fontSize: "12px", fontFamily: "Century Gothic" } },
                    },
                    yaxis: {
                      labels: { formatter: (val) => `$${val}`, style: {fontFamily: "Century Gothic"}},
                    },
                    stroke: { curve: "smooth", width: 3 },
                    markers: { size: 5 },
                    tooltip: {
                      y: { formatter: (val) => `$${val.toFixed(2)}` },
                    },
                    grid: { borderColor: "#e0e0e0", strokeDashArray: 4 },
                    theme: { mode: "light" },
                  }}
                />
              </div>
           </div>
           </div>
          </div>
        </div>
    </>
  );
}

export default AdminHub;
