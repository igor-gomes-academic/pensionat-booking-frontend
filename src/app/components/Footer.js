export default function Footer() {
    return (
        <footer 
        style={{
            backgroundColor: "#2f4156",
            color: "white",
            textAlign: "center",
            padding: "1.5rem",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
        }}> 
         <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Ocean View Lodge
         </p>
         <p style={{ margin: "0.5rem 0 0", opacity: 0.85 }}>
            Created by Daniel, Igor, Niklas, Patric
         </p>
    </footer>
    )
}