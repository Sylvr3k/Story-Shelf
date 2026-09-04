import React, { useEffect, useState, useMemo } from "react";
import Footer from "./Footer";
import Card from "./Card";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";

function Shop({ onBuy, purchasedItems = {} }) {
  const [items, setItems] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Get USER ID from token
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);

        // Extract USER ID properly
        const userId =
          decoded.userId ||
          decoded.id ||
          decoded._id ||
          decoded.sub || "";

        console.log("Current User ID:", userId);

        setCurrentUserId(String(userId).trim() || null);
      } catch (err) {
        console.error("Token decode failed", err);
        setCurrentUserId(null);
      }
    }

    // Fetch books
    fetch("http://localhost:5009/books")
      .then((res) => res.json())
      .then((data) => {
        console.log("First book object:", data[0]);
        setItems(data || []);
      })
      .catch((err) => console.error("Fetch error", err))
      .finally(() => setLoading(false));
  }, []);

  // FILTERS USING USER ID
  const filteredItems = useMemo(() => {
    if (!items.length) return [];

    return items.filter((item) => {
      if (!item) return false;

      const sellerId = String(item.sellerId?._id || "").trim();
      const currentId = String(currentUserId || "").trim();

      console.log("Comparing IDs:", {
        sellerId,
        currentId
      });

      // Hides ONLY your own books
      const isNotMine = !currentId || sellerId !== currentId;

      const title = (item.title || "").toLowerCase().trim();
      const matchesSearch =
        searchTerm === "" ||
        title.includes(searchTerm.toLowerCase().trim());

      return isNotMine && matchesSearch;
    });
  }, [items, currentUserId, searchTerm]);

  return (
    <>
      <Navbar />

      <div className="Body">
        {/* Search Bar */}
        <div style={{ padding: "20px", textAlign: "center" }}>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              width: "100%",
              maxWidth: "550px",
            }}
          >
            <input
              type="text"
              placeholder="Search for books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: "#fbfbfb",
                padding: "16px 40px 16px 20px",
                width: "100%",
                borderRadius: "27px",
                border: "1px solid #ddd",
                outline: "none",
                fontSize: "16px",
              }}
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "30%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#999",
                  fontSize: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Items */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {filteredItems.length === 0 ? (
            <div className="HeadMo">
              <h1>
                {searchTerm
                  ? `No Books found matching "${searchTerm}"`
                  : "No Books!"}
              </h1>
            </div>
          ) : (
            filteredItems.map((item) => {
              const itemId = String(item._id || item.id);
              const isPurchased = !!purchasedItems[itemId];

              return (
                <Card key={itemId} {...item}>
                  <button
                    onClick={() => !isPurchased && onBuy(item)}
                    disabled={isPurchased}
                    style={{
                      backgroundColor: isPurchased ? "#6c757d" : "#0d6efd",
                      color: "#fff",
                      borderRadius: "5px",
                      padding: "10px",
                      width: "140px",
                      border: "none",
                      cursor: isPurchased ? "not-allowed" : "pointer",
                      opacity: isPurchased ? 0.6 : 1,
                    }}
                  >
                    {isPurchased ? "Added to Cart" : "Add to Cart"}
                  </button>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Shop;