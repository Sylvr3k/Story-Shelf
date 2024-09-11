import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Cart({ cartItems, onRemove, onCheckout }) {
    return(
        <>
        <Navbar/>
        <div className="Cart">
            {cartItems.length === 0 ? (
              <div className="HeadMo">
                <h1>No Orders!</h1>
              </div>
            ) : (
              <>
              <ul className="CartList">
                {cartItems.map((item) => (
                    <li key={item.title}>
                      <div className="bashden">
                        <strong>{item.title}</strong>
                        <span>{item.para}</span>
                        <span>{item.price}</span>
                        <button onClick={() => onRemove(item.title)}>Remove</button>
                      </div>
                    </li>
                ))}
              </ul>
              <div className="Btn-Kiddo">
                <button className="checkout-button" onClick={onCheckout}>
                  Checkout
                </button>
              </div>
              </>
            )}
        </div>
        <Footer/>
        </>
    )
}

export default Cart;