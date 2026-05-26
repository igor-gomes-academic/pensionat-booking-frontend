"use client";

import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const customer = await response.json();
      localStorage.setItem("customer", JSON.stringify(customer));
      window.location.href = "/";
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <main>
      <Navbar />
      <HeroBanner />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
        <h1>Login</h1>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} 
        style={{ 
          padding: "0.5rem", 
          margin: "0.5rem", 
          width: "300px" , 
          backgroundColor: "#f5f5f5",
          color: "#222",
          border: "1px solid #ccc",
          borderRadius: "4px"
           }} 
           />

        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} 
        style={{ 
          padding: "0.5rem", 
          margin: "0.5rem", 
          width: "300px" , 
          backgroundColor: "#f5f5f5",
          color: "#222",
          border: "1px solid #ccc",
          borderRadius: "4px"
           }} />
        <button onClick={handleLogin} 
        style={{ 
          backgroundColor: "#2f4156", 
          color: "white", 
          padding: "0.5rem 2rem", 
          border: "none", 
          borderRadius: "4px", 
          cursor: "pointer", 
          marginTop: "1rem" 
          }}>
          Login
        </button>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </main>
  );
}