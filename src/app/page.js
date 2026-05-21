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
    <main>
      <Navbar />
      <h1>Welcome to Pensionat</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", padding: "2rem" }}>
        {rooms.map(room => (
          <RoomCard
            key={room.id}
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