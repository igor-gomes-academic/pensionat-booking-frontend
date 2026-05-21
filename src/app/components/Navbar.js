"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("customer");
    if (stored) {
      setCustomer(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    window.location.href = "/";
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", backgroundColor: "#333" }}>
      <h1 style={{ color: "white" }}>Pensionat</h1>
      <div>
        {customer ? (
          <>
            <span style={{ color: "white", marginRight: "1rem" }}>Hello, {customer.firstName}!</span>
            <button onClick={handleLogout} style={{ color: "white", background: "none", border: "1px solid white", padding: "0.3rem 1rem", cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <a href="/login" style={{ color: "white", textDecoration: "none" }}>Login</a>
        )}
      </div>
    </nav>
  );
}