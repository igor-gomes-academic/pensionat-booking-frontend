'use client'

import Navbar from "../components/Navbar"
import { useEffect, useState } from 'react'
import { useSearchParams } from "next/navigation"

const API_BASE_URL = 'http://localhost:8080/api'

const inputStyle = {
  padding: "0.5rem",
  backgroundColor: "#f5f5f5",
  color: "#222",
  border: "1px solid #ccc",
  borderRadius: "4px",
}

const buttonStyle = {
  backgroundColor: "#333",
  color: "white",
  padding: "0.5rem 2rem",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
}

export default function BookingsPage() {
  const searchParams = useSearchParams()

  const [rooms, setRooms] = useState([])
  const [customers, setCustomers] = useState([])
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [bookingForm, setBookingForm] = useState({
    customerId: '',
    roomId: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer')
    const roomIdFromUrl = searchParams.get('roomId')

    if (storedCustomer) {
      const customer = JSON.parse(storedCustomer)
      setCurrentCustomer(customer)
      setBookingForm((previousForm) => ({
        ...previousForm,
        customerId: customer.id,
        roomId: roomIdFromUrl || '',
      }))
    }

    loadData()
  }, [])

  async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Request failed')
    }

    return response.json()
  }

  async function loadData() {
    try {
      const [roomsData, customersData] = await Promise.all([
        apiRequest('/rooms'),
        apiRequest('/customers'),
      ])

      setRooms(roomsData)
      setCustomers(customersData)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  async function createBooking(event) {
    event.preventDefault()

    try {
      await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          customerId: Number(bookingForm.customerId),
          roomId: Number(bookingForm.roomId),
          startDate: bookingForm.startDate,
          endDate: bookingForm.endDate,
        }),
      })

      setBookingForm({
        customerId: currentCustomer ? currentCustomer.id : '',
        roomId: '',
        startDate: '',
        endDate: '',
      })

      setMessage('Booking created successfully')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main>
      <Navbar />

      <div style={{ padding: "2rem" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
          Bookings
        </h1>

        {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <section style={{ marginBottom: "2rem" }}>
          <h2>Create booking</h2>

          <form onSubmit={createBooking} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            {currentCustomer ? (
              <input
                value={`${currentCustomer.firstName} ${currentCustomer.lastName}`}
                readOnly
                style={inputStyle}
              />
            ) : (
              <select
                value={bookingForm.customerId}
                onChange={(e) => setBookingForm({ ...bookingForm, customerId: e.target.value })}
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
              disabled={!!searchParams.get('roomId')}
              onChange={(e) => setBookingForm({ ...bookingForm, roomId: e.target.value })}
              style={inputStyle}
            >
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber}
                </option>
              ))}
            </select>

            <input type="date" value={bookingForm.startDate} onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })} style={inputStyle} />
            <input type="date" value={bookingForm.endDate} onChange={(e) => setBookingForm({ ...bookingForm, endDate: e.target.value })} style={inputStyle} />

            <button type="submit" style={buttonStyle}>
              Create booking
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}