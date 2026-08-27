"use client";

import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_BOOKING_URL = "http://localhost:8080/api";
const API_CUSTOMER_URL = "http://localhost:8081/api";

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

export default function BookingsPage() {
  const searchParams = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [bookingForm, setBookingForm] = useState({
    customerId: customers.id,
    roomId: rooms.id,
    startDate: "",
    endDate: "",
    extraBed: false,
  });

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");
    const roomIdFromUrl = searchParams.get("roomId");

    if (storedCustomer) {
      const customer = JSON.parse(storedCustomer);
      setCurrentCustomer(customer);
      setBookingForm((previousForm) => ({
        ...previousForm,
        customerId: customer.id,
        roomId: roomIdFromUrl || "",
      }));
    }

    loadData();
  }, []);

  async function apiRequest(baseUrl, path, options = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Request failed");
    }

    return response.json();
  }

  async function loadData() {
    try {
      const [roomsData, customersData] = await Promise.all([
        apiRequest(API_BOOKING_URL, "/rooms"),
        apiRequest(API_CUSTOMER_URL, "/customers"),
      ]);

      setRooms(roomsData);
      setCustomers(customersData);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function createBooking(event) {
    event.preventDefault();

    try {
      await apiRequest(API_BOOKING_URL, "/bookings", {
        method: "POST",
        body: JSON.stringify({
          customerId: Number(bookingForm.customerId),
          roomId: Number(bookingForm.roomId),
          startDate: bookingForm.startDate,
          endDate: bookingForm.endDate,
          extraBed: bookingForm.extraBed,
        }),
      });

      setBookingForm({
        customerId: currentCustomer ? currentCustomer.id : "",
        roomId: "",
        startDate: "",
        endDate: "",
        extraBed: false,
      });

      setMessage("Booking created successfully");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }
  const selectedRoom = rooms.find(
    (room) => Number(room.id) === Number(bookingForm.roomId),
  );

  return (
    <main>
      <Navbar />
      <HeroBanner />
      <div style={{ padding: "2rem" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            alignItems: "center",
          }}
        >
          Bookings
        </h1>

        {message && (
          <p style={{ color: "green", textAlign: "center" }}>{message}</p>
        )}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <section
          style={{
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <h2>Create booking</h2>

          <form
            onSubmit={createBooking}
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {currentCustomer ? (
              <input
                value={`${currentCustomer.firstName} ${currentCustomer.lastName}`}
                readOnly
                style={inputStyle}
              />
            ) : (
              <select
                value={bookingForm.customerId}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, customerId: e.target.value })
                }
                style={inputStyle}
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
            )}

            <select
              value={bookingForm.roomId}
              disabled={!!searchParams.get("roomId")}
              onChange={(e) => {
                const selectedRoomId = e.target.value;

                const room = rooms.find(
                  (r) => Number(r.id) === Number(selectedRoomId),
                );

                setBookingForm({
                  ...bookingForm,
                  roomId: selectedRoomId,
                  extraBed:
                    room?.roomType === "DOUBLE" ? bookingForm.extraBed : false,
                });
              }}
              style={inputStyle}
            >
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber}
                </option>
              ))}
            </select>

            {selectedRoom?.roomType === "DOUBLE" && (
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#1f2937",
                  minWidth: "140px",
                }}
              >
                <input
                  type="checkbox"
                  checked={bookingForm.extraBed}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      extraBed: e.target.checked,
                    })
                  }
                />
                Extra bed
              </label>
            )}

            <input
              type="date"
              value={bookingForm.startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                const newStartDate = e.target.value;

                setBookingForm({
                  ...bookingForm,
                  startDate: newStartDate,
                  endDate:
                    bookingForm.endDate && bookingForm.endDate <= newStartDate
                      ? ""
                      : bookingForm.endDate,
                });
              }}
              style={inputStyle}
            />

            <input
              type="date"
              value={bookingForm.endDate}
              min={
                bookingForm.startDate || new Date().toISOString().split("T")[0]
              }
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  endDate: e.target.value,
                })
              }
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
              Create booking
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
