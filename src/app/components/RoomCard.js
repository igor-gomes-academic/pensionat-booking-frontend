export default function RoomCard({ roomNumber, type, price, photoUrl, description, id }) {
  const handleBookNow = () => {
    const customer = localStorage.getItem("customer")

    if (customer) {
      window.location.href = `/bookings?roomId=${id}`
    } else {
      window.location.href = "/login"
    }
  }

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      width: "200px",
      textAlign: "center",
      overflow: "hidden"
    }}>
      <img
        src={photoUrl}
        alt={`Room ${roomNumber}`}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />

      <div style={{ padding: "1rem" }}>
        <h2>Room {roomNumber}</h2>

        <p>{type}</p>

        <p>{price} SEK / night</p>

        <p style={{ fontSize: "0.85rem", color: "#666" }}>
          {description}
        </p>

        <button
          onClick={handleBookNow}
          style={{
            backgroundColor: "#333",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}