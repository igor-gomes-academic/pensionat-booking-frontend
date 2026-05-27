"use client";

import { useState, useEffect } from "react";

const navColor = "#2f4156";

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

  const navButtonStyle = {
    color: "white",
    textDecoration: "none",
    border: "1 px solid white",
    padding: "0.3rem 1rem",
    cursor: "pointer",
    display: "inline-block",
    background: "none",
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: navColor,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <a href="/" style={navButtonStyle}>
          Home
        </a>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <h1
          style={{
            color: "white",
            margin: 0,
            fontSize: "1.8rem",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          Ocean View Lodge
        </h1>
      </div>

      <div>
        {customer ? (
          <>
            <span style={{ color: "white", marginRight: "1rem" }}>
              Hello, {customer.firstName}!
            </span>

            <a
              href="/account"
              style={{ ...navButtonStyle, marginRight: "1rem" }}
            >
              Account
            </a>

            <button onClick={handleLogout} style={navButtonStyle}>
              Logout
            </button>
          </>
        ) : (
          <a href="/login" style={navButtonStyle}>
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
