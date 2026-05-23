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
  width: "300px"
}

const buttonStyle = {
  backgroundColor: "#333",
  color: "white",
  padding: "0.5rem 2rem",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
}

export default function AccountPage() {
  const [customer, setCustomer] = useState(null)
  const [bookings, setBookings] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showEditForm, setShowEditForm] = useState(false)

  const [updateForm, setUpdateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    hashedPassword: '',
    phone: ''
  })

  useEffect(() => {
    const stored = localStorage.getItem('customer')
    if (stored) {
      const parsed = JSON.parse(stored)
      setCustomer(parsed)
      setUpdateForm({
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        hashedPassword: '',
        phone: parsed.phoneNumber
      })
      loadBookings(parsed.id)
    } else {
      window.location.href = '/login'
    }
  }, [])

  async function loadBookings(customerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`)
      const data = await response.json()
      setBookings(data.filter(b => b.customerId === customerId))
    } catch (err) {
      setError(err.message)
    }
  }

async function handleUpdate(e) {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateForm)
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Failed to update')
      }

      const updated = await response.json()
      localStorage.setItem('customer', JSON.stringify(updated))
      setCustomer(updated)
      setUpdateForm({
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        hashedPassword: '',
        phone: updated.phoneNumber
      })
      setMessage('Account updated successfully!')
      setError('')
      setShowEditForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  async function cancelBooking(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
        method: 'PATCH',
      })

      if (!response.ok) throw new Error('Failed to cancel booking')

      setMessage('Booking cancelled successfully')
      setError('')
      loadBookings(customer.id)
    } catch (err) {
      setError(err.message)
    }
  }

  if (!customer) return null

  return (
    <main>
      <Navbar />
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1>My Account</h1>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <section style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h2>Personal Information</h2>
            <button
              onClick={() => setShowEditForm(!showEditForm)}
              style={buttonStyle}>
              {showEditForm ? "Cancel" : "Edit Information"}
            </button>
          </div>

          {!showEditForm && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <p><strong>First Name:</strong> {customer.firstName}</p>
              <p><strong>Last Name:</strong> {customer.lastName}</p>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Phone:</strong> {customer.phoneNumber}</p>
            </div>
          )}

          {showEditForm && (
            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <input placeholder="First Name" value={updateForm.firstName} onChange={e => setUpdateForm({ ...updateForm, firstName: e.target.value })} style={inputStyle} />
              <input placeholder="Last Name" value={updateForm.lastName} onChange={e => setUpdateForm({ ...updateForm, lastName: e.target.value })} style={inputStyle} />
              <input type="email" placeholder="Email" value={updateForm.email} onChange={e => setUpdateForm({ ...updateForm, email: e.target.value })} style={inputStyle} />
              <input type="password" placeholder="New Password (leave blank to keep current)" value={updateForm.hashedPassword} onChange={e => setUpdateForm({ ...updateForm, hashedPassword: e.target.value })} style={inputStyle} />
              <input placeholder="Phone Number" value={updateForm.phone} onChange={e => setUpdateForm({ ...updateForm, phone: e.target.value })} style={inputStyle} />
              <button type="submit" style={{ ...buttonStyle, width: "300px" }}>Save Changes</button>
            </form>
          )}
        </section>

        <section>
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings found</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Room</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Check-in</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Check-out</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td style={{ padding: "0.5rem" }}>Room {booking.roomNumber}</td>
                    <td style={{ padding: "0.5rem" }}>{booking.startDate}</td>
                    <td style={{ padding: "0.5rem" }}>{booking.endDate}</td>
                    <td style={{ padding: "0.5rem" }}>{booking.status}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {booking.status === 'ACTIVE' && (
                        <button onClick={() => cancelBooking(booking.id)} style={{ ...buttonStyle, padding: "0.4rem 1rem" }}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  )
}