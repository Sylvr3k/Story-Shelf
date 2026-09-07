import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";

function Cart({ cartItems, onRemove, onCheckout }) {
  const [loading, setLoading] = React.useState(false);
  const [paymentStatus, setPaymentStatus] = React.useState("idle");

  let currentUser = null;

  try {
    const token = localStorage.getItem("token");
    if (token) currentUser = jwtDecode(token);
  } catch (err) {
    console.error("Invalid token", err);
  }

  const handleCheckout = async () => {
    if (!currentUser) return alert("Login required");
    if (!cartItems.length) return alert("Cart is empty");

    const phone = prompt("Enter Mpesa number (2547...)");
    if (!phone) return;

    try {
      setLoading(true);
      setPaymentStatus("pending");

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + Number(item.price),
        0,
      );

      // 1. Create order (PENDING)
      const orderRes = await fetch("http://localhost:5009/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          buyerId: currentUser._id || currentUser.id,
          buyerEmail: currentUser.email,
          buyerName: currentUser.name,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setPaymentStatus("failed");
        return alert(orderData.error || "Order failed");
      }

      const orderId = orderData.orderId;
      const orderIds = orderData.orderIds;

      // 2. Trigger STK push
      const stkRes = await fetch("http://localhost:5009/orders/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount: totalAmount,
          orderId,
          orderIds,
        }),
      });

      const stkData = await stkRes.json();

      if (stkRes.ok && stkData.success !== false) {
        setPaymentStatus("pending");
        alert(
          "Payment request sent. Check your phone and enter your M-Pesa PIN.",
        );
      } else {
        setPaymentStatus("failed");
        alert(stkData.error || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      setPaymentStatus("failed");
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="Cart">
        {cartItems.length === 0 ? (
          <div className="HeadMost">
            <h1>No Orders!</h1>
          </div>
        ) : (
          <>
            <ul className="CartList">
              {cartItems.map((item) => (
                <li key={item._id}>
                  <div className="bashden">
                    <strong>{item.title}</strong>
                    <span>{item.para}</span>
                    <span>{item.price} USD</span>
                    <button onClick={() => onRemove(item._id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="Btn-Kiddo">
              <button onClick={handleCheckout} disabled={loading}>
                {loading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Cart;
