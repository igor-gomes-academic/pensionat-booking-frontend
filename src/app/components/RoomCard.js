export default function RoomCard({
  roomNumber,
  type,
  price,
  photoUrl,
  description,
  id,
}) {
  const handleBookNow = () => {
    const customer = localStorage.getItem("customer");

    if (customer) {
      window.location.href = `/bookings?roomId=${id}`;
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "200px",
        textAlign: "center",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <img
        src={photoUrl}
        alt={`Room ${roomNumber}`}
        style={{ width: "100%", height: "150px", objectFit: "cover" }}
      />

      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <h2 style={{ color: "#666" }}>Room {roomNumber}</h2>

        <p style ={{color: "#666"}}>{type}</p>

        <p style ={{color: "#666"}}>{price} SEK / night</p>

        <p style={{ fontSize: "0.85rem", color: "#666" }}>{description}</p>

        <button
          onClick={handleBookNow}
          style={{
            backgroundColor: "#2f4156",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "auto",
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
