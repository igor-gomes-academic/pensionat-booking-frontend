"use client";

import Navbar from "./components/Navbar";
import RoomCard from "./components/RoomCard";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/rooms")
      .then(res => res.json())
      .then(data => setRooms(data));
  }, []);

  return (
    <main
      style={{
        background: "linear-gradient(to bottom, #dbe7f0 0%, #f5f7fa 20%, white 40%)", 
        minHeight: "100vh"
      }} 
      >

      <Navbar />

      <section
        style={{
          width: "100%", 
          height: "793px", 
          backgroundImage: "url('/images/ocean_view_picture.png')",
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat", 
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
        }}
        />
        <h1 
        style = {{
          textAlign: "center", 
          marginTop: "3rem", 
          fontSize: "2.8rem",
          fontWeight: "300", 
          letterSpacing: "1px", 
          color: "#1f2937"
        }} 
        >

        Welcome to Ocean View Lodge
        </h1>

      <div style={{ 
        display: "flex",
        flexWrap: "wrap", 
        gap: "1rem", 
        padding: "2rem",
        justifyContent: "center"
        }}
        >
        {rooms.map(room => (
          <RoomCard
            key={room.id}
            id={room.id}
            roomNumber={room.roomNumber}
            type={room.roomType}
            price={room.pricePerNight}
            photoUrl={room.photoUrl}
            description={room.description}
          />
        ))}
      </div>
    </main>
  );
}