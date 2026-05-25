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
    <nav style={{
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "1rem", 
          backgroundColor: "#2f4156", 
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15" 
          }}
          >

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <h1 style={{ color: "white", margin: 0 }}>Pensionat</h1>
        <a href="/" style={{ color: "white", textDecoration: "none", border: "1px solid white", padding: "0.3rem 1rem", cursor: "pointer" }}>Home</a>
      </div>
      <div>
        {customer ? (
          <>
            <span style={{ color: "white", marginRight: "1rem" }}>Hello, {customer.firstName}!</span>
            <a href="/account" style={{ color: "white", textDecoration: "none", marginRight: "3rem", border: "1px solid white", padding: "0.3rem 1rem", cursor: "pointer", display: "inline-block" }}>Account</a>
            <button onClick={handleLogout} style={{ color: "white", background: "none", border: "1px solid white", padding: "0.3rem 1rem", cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <a href="/login" style={{ color: "white", textDecoration: "none", border: "1px solid white", padding: "0.3rem 1rem", cursor: "pointer",display: "inline-block" }}>Login</a>
        )}
      </div>
    </nav>
  );
}