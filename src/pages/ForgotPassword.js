import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5009/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    alert(data.message || "Reset link sent");

    console.log("RESET LINK:", data.resetLink);
  };

  return (
    <div className="OuterForm2">
  

      <form className="FormLog" onSubmit={handleSubmit}>
        <div className="Picon">
          <h2>Reset Your Password</h2>
        </div>

        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="Inlines">
          <button type="submit">
            Send Reset Link
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;