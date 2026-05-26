'use client'

import Navbar from "../components/Navbar"
import HeroBanner from "../components/HeroBanner"
import { useEffect, useState } from 'react'

const API_BASE_URL = 'http://localhost:8080/api'

const inputStyle = {
  padding: "0.5rem",
  backgroundColor: "#f5f5f5",
  color: "#222",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "300px",
  height: "47px"
}

const buttonStyle = {
  backgroundColor: "#2f4156",
  color: "white",
  padding: "0.5rem 2rem",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
}

export default function AccountPage() {
  const [customer, setCustomer] = useState(null)
  const [bookings, setBookings] = useState([])
  const [rooms, setRooms] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showEditForm, setShowEditForm] = useState(false)
  const [editBookingId, setEditBookingId] = useState(null)

  const [updateForm, setUpdateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    hashedPassword: '',
    phone: ''
  })

  const [updateBookingForm, setUpdateBookingForm] = useState({
    roomId: '',
    startDate: '',
    endDate: '',
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
      loadRooms()
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

  async function loadRooms() {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`)
      const data = await response.json()
      setRooms(data)
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

  async function handleDeleteAccount() {
    const hasActiveBooking = bookings.some(booking => booking.status === 'ACTIVE')

    if (hasActiveBooking) {
      setMessage('')
      setError('Customer cannot be deleted with an active booking')
      return
    }

    const confirmed = window.confirm('Are you sure you want to delete your account? All your data will be permanently removed and cannot be recovered.')

    if (!confirmed) return

    try {
      const response = await fetch(`${API_BASE_URL}/customers/${customer.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Failed to delete account')
      }

      localStorage.removeItem('customer')
      window.location.href = '/'
    } catch (err) {
      setMessage('')
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

  function startEditBooking(booking) {
    const matchedRoom = rooms.find(r => r.id === booking.roomId)

    setEditBookingId(booking.id)
    setUpdateBookingForm({
      roomId: matchedRoom?.id || booking.room?.id || '',
      startDate: booking.startDate,
      endDate: booking.endDate,
    })
  }

  async function updateBooking(e) {
    e.preventDefault()

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${editBookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          roomId: Number(updateBookingForm.roomId),
          startDate: updateBookingForm.startDate,
          endDate: updateBookingForm.endDate,
        }),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Failed to update booking')
      }

      setMessage('Booking updated successfully')
      setError('')
      setEditBookingId(null)
      loadBookings(customer.id)
    } catch (err) {
      setError(err.message)
    }
  }

  if (!customer) return null

  return (
    <main>
      <Navbar />
      <HeroBanner />
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
              <button
                onClick={handleDeleteAccount}
                style={{ ...buttonStyle, backgroundColor: "#b00020", width: "300px" }}
              >
                Delete Account
              </button>
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
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => startEditBooking(booking)} style={{ ...buttonStyle, padding: "0.4rem 1rem" }}>
                            Edit
                          </button>

                          <button onClick={() => cancelBooking(booking.id)} style={{ ...buttonStyle, padding: "0.4rem 1rem" }}>
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {editBookingId && (
            <form
              onSubmit={updateBooking}
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                alignItems: "center",
                marginTop: "1.5rem",
              }}
            >
              <select
                value={updateBookingForm.roomId}
                onChange={(e) =>
                  setUpdateBookingForm({ ...updateBookingForm, roomId: e.target.value })
                }
                style={inputStyle}
              >
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={updateBookingForm.startDate}
                onChange={(e) =>
                  setUpdateBookingForm({ ...updateBookingForm, startDate: e.target.value })
                }
                style={inputStyle}
              />

              <input
                type="date"
                value={updateBookingForm.endDate}
                onChange={(e) =>
                  setUpdateBookingForm({ ...updateBookingForm, endDate: e.target.value })
                }
                style={inputStyle}
              />

              <button type="submit" style={buttonStyle}>
                Save booking
              </button>

              <button
                type="button"
                onClick={() => setEditBookingId(null)}
                style={buttonStyle}
              >
                Cancel edit
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}