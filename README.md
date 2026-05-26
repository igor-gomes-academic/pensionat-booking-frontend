# Pensionat Booking Frontend

Frontend application for a guesthouse booking system built with Next.js and React.

The application allows customers to browse rooms, create bookings, manage their account and interact with the backend API through a responsive web interface.

---

## Related Repository

**Backend:** [pensionat-booking-backend](https://github.com/Igor-01-Gomes/pensionat-booking-backend)

## Architecture Overview

```text
User
  ↓
Frontend (Next.js / React)
  ↓ REST API requests
Backend (Spring Boot API)
  ↓ Spring Data JPA / Hibernate
MySQL Database
```

---

## Technologies

- Next.js
- React
- JavaScript
- CSS
- REST API
- Fetch API

---

## Project Structure

The frontend is organized into different pages and reusable components:

- **Pages** – Handles routing and page rendering
- **Components** – Reusable UI components
- **API communication** – Handles requests to the backend API
- **State handling** – Manages frontend data and user interactions
- **Styling** – Handles layout and visual presentation

---

## Functionality

The frontend supports:

1. Viewing available rooms
2. Displaying room information and pricing
3. Customer registration and login
4. Creating bookings
5. Updating bookings
6. Cancelling bookings
7. Searching available rooms
8. Viewing customer account information
9. Updating customer account information
10. Deleting customer accounts
11. Displaying validation and error messages
12. Integrating with the backend REST API

---

## API Communication

The frontend communicates with the Spring Boot backend through REST API endpoints.

The API is used for:

- Customer management
- Room management
- Booking management
- Account deletion
- Room availability searches

---

## Business Rules

- Customers cannot delete accounts with active bookings
- Booking conflicts are prevented through backend validation
- Room availability is updated based on booking dates
- Validation and error messages are displayed to the user

---

## Configuration

The frontend communicates with the backend API running locally on port `8080`.

Make sure the backend application is running before starting the frontend.

---

## Running the Application

The frontend runs locally on:

```text
http://localhost:3000
```

Start the development server with:

```bash
npm install
npm run dev
```

---

## Team

- Patric Westman
- Daniel Lyytikäinen
- Niklas Dahlström
- Igor Gomes