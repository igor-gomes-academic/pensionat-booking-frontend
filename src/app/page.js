"use client";

import HeroBanner from "./components/HeroBanner";
import Navbar from "./components/Navbar";
import RoomCard from "./components/RoomCard";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";

const inputStyle = {
  padding: "0.5rem",
  backgroundColor: "#f5f5f5",
  color: "#222",
  border: "1px solid #ccc",
  borderRadius: "4px",
  height: "47px",
  width: "150px",
};

const buttonStyle = {
  backgroundColor: "#2f4156",
  color: "white",
  padding: "0.5rem 2rem",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, []);

  async function searchAvailableRooms(e) {
    e.preventDefault();
    setSearching(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/rooms/available?startDate=${startDate}&endDate=${endDate}`,
      );
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    } finally {
      setSearching(false);
    }
  }
  async function clearSearch() {
    setStartDate("");
    setEndDate("");
    setSearching(false);
    fetch("http://localhost:8080/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }

  return (
    <main
      style={{
        background:
          "linear-gradient(to bottom, #dbe7f0 0%, #f5f7fa 20%, white 40%)",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <HeroBanner />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "2rem 0",
          gap: "1rem",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#1f2937",
            fontWeight: "400",
            letterSpacing: "1px",
          }}
        >
          Search Available Rooms
        </h3>
        <form
          onSubmit={searchAvailableRooms}
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
        >
          <input
            type="date"
            value={startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (endDate && endDate <= e.target.value) setEndDate("");
            }}
            style={inputStyle}
          />
          <input
            type="date"
            value={endDate}
            min={startDate || new Date().toISOString().split("T")[0]}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Search
          </button>
          {searching && (
            <button type="button" onClick={clearSearch} style={buttonStyle}>
              Clear
            </button>
          )}
        </form>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          padding: "2rem",
          justifyContent: "center",
        }}
      >
        {rooms.map((room) => (
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
    <Footer />
    </main>
  );
}
