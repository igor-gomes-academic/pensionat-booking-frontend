'use client'

import Navbar from "../components/Navbar"
import { useEffect, useState } from 'react'

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
  const [rooms, setRooms] = useState([])
  const [customers, setCustomers] = useState([])
  const [bookings, setBookings] = useState([])
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [bookingForm, setBookingForm] = useState({
    customerId: '',
    roomId: '',
    startDate: '',
    endDate: '',
  })

  const [updateBookingForm, setUpdateBookingForm] = useState({
    id: '',
    customerId: '',
    roomId: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer')

    if (storedCustomer) {
      const customer = JSON.parse(storedCustomer)
      setCurrentCustomer(customer)

      setBookingForm((previousForm) => ({
        ...previousForm,
        customerId: customer.id,
      }))

      setUpdateBookingForm((previousForm) => ({
        ...previousForm,
        customerId: customer.id,
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
      const [roomsData, customersData, bookingsData] = await Promise.all([
        apiRequest('/rooms'),
        apiRequest('/customers'),
        apiRequest('/bookings'),
      ])

      setRooms(roomsData)
      setCustomers(customersData)
      setBookings(bookingsData)
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
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function updateBooking(event) {
    event.preventDefault()

    try {
      await apiRequest(`/bookings/${updateBookingForm.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          customerId: Number(updateBookingForm.customerId),
          roomId: Number(updateBookingForm.roomId),
          startDate: updateBookingForm.startDate,
          endDate: updateBookingForm.endDate,
        }),
      })

      setMessage('Booking updated successfully')
      setError('')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function cancelBooking(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Request failed')
      }

      setMessage('Booking cancelled successfully')
      setError('')
      loadData()
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

        <section style={{ marginBottom: "2rem" }}>
          <h2>Update booking</h2>

          <form onSubmit={updateBooking} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <input
              placeholder="Booking ID"
              value={updateBookingForm.id}
              onChange={(e) => setUpdateBookingForm({ ...updateBookingForm, id: e.target.value })}
              style={inputStyle}
            />

            {currentCustomer ? (
              <input
                value={`${currentCustomer.firstName} ${currentCustomer.lastName}`}
                readOnly
                style={inputStyle}
              />
            ) : (
              <select
                value={updateBookingForm.customerId}
                onChange={(e) => setUpdateBookingForm({ ...updateBookingForm, customerId: e.target.value })}
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
              value={updateBookingForm.roomId}
              onChange={(e) => setUpdateBookingForm({ ...updateBookingForm, roomId: e.target.value })}
              style={inputStyle}
            >
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber}
                </option>
              ))}
            </select>

            <input type="date" value={updateBookingForm.startDate} onChange={(e) => setUpdateBookingForm({ ...updateBookingForm, startDate: e.target.value })} style={inputStyle} />
            <input type="date" value={updateBookingForm.endDate} onChange={(e) => setUpdateBookingForm({ ...updateBookingForm, endDate: e.target.value })} style={inputStyle} />

            <button type="submit" style={buttonStyle}>
              Update booking
            </button>
          </form>
        </section>

        <section>
          <h2>My bookings</h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>ID</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Customer</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Room</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Dates</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Status</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings
                .filter((booking) =>
                  currentCustomer ? booking.customer?.id === currentCustomer.id : true
                )
                .map((booking) => (
                  <tr key={booking.id}>
                    <td style={{ padding: "0.5rem" }}>{booking.id}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {booking.customer?.firstName} {booking.customer?.lastName}
                    </td>
                    <td style={{ padding: "0.5rem" }}>Room {booking.room?.roomNumber}</td>
                    <td style={{ padding: "0.5rem" }}>{booking.startDate} to {booking.endDate}</td>
                    <td style={{ padding: "0.5rem" }}>{booking.bookingStatus}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {booking.bookingStatus === 'ACTIVE' && (
                        <button onClick={() => cancelBooking(booking.id)} style={{ ...buttonStyle, padding: "0.4rem 1rem" }}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  )
}