"use client";

import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer"
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    hashedPassword: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:8080/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert("Account created successfully!");
      window.location.href = "/login";
    } else {
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <main>
      <Navbar />
      <HeroBanner />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
        <h1>Create Account</h1>
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} 
        style={{ 
          padding: "0.7rem", 
          margin: "0.5rem", 
          width: "300px", 
          backgroundColor: "white",
          color: "#222",
          border: "1px solid #ccc",
          borderRadius: "6px" 
          }} />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} 
        style={{ 
          padding: "0.7rem", 
          margin: "0.5rem", 
          width: "300px", 
          backgroundColor: "white",
          color: "#222",
          border: "1px solid #ccc",
          borderRadius: "6px",  
          }} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} 
        style={{ 
          padding: "0.7rem", 
          margin: "0.5rem", 
          width: "300px", 
          backgroundColor: "white",
          color: "#222",
          border: "1px solid #ccc",
          borderRadius: "6px" 
          }} />
        <input type="password" name="hashedPassword" placeholder="Password" onChange={handleChange} 
        style={{ 
          padding: "0.5rem", 
          margin: "0.5rem", 
          width: "300px", 
          backgroundColor: "#f5f5f5",
          color: "#222",
          border: "1px solid #ccc",
          borderRadius: "4px" 
          }} />
        <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} 
        style={{ 
          padding: "0.5rem", 
          margin: "0.5rem", 
          width: "300px", 
          backgroundColor: "#f5f5f5",
          color: "#222",
          border: "1px solid #ccc",
          borderRadius: "4px"
          }} />
        <button onClick={handleSubmit} style={{ backgroundColor: "#333", color: "white", padding: "0.5rem 2rem", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "1rem" }}>
          Create Account
        </button>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
      <Footer />
    </main>
  );
}