import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/authRouter.js";
import bookingRouter from "./routes/bookingRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import routesRouter from "./routes/routesRouter.js";
import ticketsRouter from "./routes/ticketsRouter.js";
import vehiclesRouter from "./routes/vehiclesRouter.js";
import communityRouter from "./routes/communityRouter.js";
import passport from "./config/passport.js";
import prisma from "./lib/prisma.js";

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingRouter);
app.use("/services", serviceRouter);
app.use("/routes", routesRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/community", communityRouter);

app.get("/", (req, res) => {
  res.send("Backend deveopment has started");
});

const results = [];

function record(name, passed, details = "") {
  results.push({ name, passed, details });
  const status = passed ? "PASS" : "FAIL";
  console.log(`[${status}] ${name}${details ? " -> " + details : ""}`);
}

async function run() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log(`\n========================================`);
  console.log(`RUNNING MOBILIX BACKEND TEST SUITE (PORT: ${port})`);
  console.log(`========================================\n`);

  try {
    // 1. Root route
    {
      const res = await fetch(`${baseUrl}/`);
      const text = await res.text();
      record("GET /", res.status === 200 && text.includes("Backend deveopment has started"), `Status: ${res.status}, body: "${text}"`);
    }

    // 2. Stubs (/services, /routes, /vehicles, /community)
    {
      const res1 = await fetch(`${baseUrl}/services`);
      record("GET /services", res1.status === 200, `Status: ${res1.status}`);

      const res2 = await fetch(`${baseUrl}/routes`);
      record("GET /routes", res2.status === 200, `Status: ${res2.status}`);

      const res3 = await fetch(`${baseUrl}/vehicles`);
      record("GET /vehicles", res3.status === 200, `Status: ${res3.status}`);

      const res4 = await fetch(`${baseUrl}/community`);
      record("GET /community", res4.status === 200, `Status: ${res4.status}`);

      const resApi = await fetch(`${baseUrl}/api/services`);
      record(
        "Frontend prefix alignment: GET /api/services",
        resApi.status === 200,
        `Status: ${resApi.status} (Frontend baseURL uses /api/, but route is mounted at root /services)`
      );
    }

    // 3. User Registration
    let authToken = "";
    const testEmail = `testuser_${Date.now()}@example.com`;
    {
      // Valid registration
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: testEmail,
          password: "password123",
        }),
      });
      const data = await res.json();
      authToken = data.token;
      record(
        "POST /api/auth/register (Valid registration)",
        res.status === 201 && data.status === "success" && !!data.token,
        `Status: ${res.status}, Token: ${!!data.token}`
      );
    }

    {
      // Duplicate registration
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Duplicate",
          email: testEmail,
          password: "password123",
        }),
      });
      const data = await res.json();
      record(
        "POST /api/auth/register (Duplicate Email)",
        res.status === 400 && data.message === "User with this email already exists.",
        `Status: ${res.status}, Message: "${data.message}"`
      );
    }

    {
      // Short password (< 6 chars)
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Short Pass",
          email: "short@example.com",
          password: "123",
        }),
      });
      const data = await res.json();
      record(
        "POST /api/auth/register (Password < 6 characters)",
        res.status === 400 && data.errors?.some(e => e.msg.includes("at least 6 characters")),
        `Status: ${res.status}`
      );
    }

    {
      // Missing email
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "No Email",
          password: "password123",
        }),
      });
      record(
        "POST /api/auth/register (Missing Email)",
        res.status === 400,
        `Status: ${res.status}`
      );
    }

    // 4. User Login
    {
      // Valid login
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: "password123",
        }),
      });
      const data = await res.json();
      record(
        "POST /api/auth/login (Valid credentials)",
        res.status === 200 && data.status === "success" && !!data.token,
        `Status: ${res.status}`
      );
    }

    {
      // Wrong password
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: "wrongpassword",
        }),
      });
      const bodyText = await res.text();
      record(
        "POST /api/auth/login (Wrong password)",
        res.status === 401,
        `Status: ${res.status}, Body: "${bodyText}" (Passport returns plain text instead of JSON)`
      );
    }

    {
      // Non-existent email
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: "password123",
        }),
      });
      record(
        "POST /api/auth/login (Non-existent email)",
        res.status === 401,
        `Status: ${res.status}`
      );
    }

    // 5. Auth /me (Protected)
    {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      record(
        "GET /api/auth/me (Valid Bearer token)",
        res.status === 200 && data.user?.email === testEmail,
        `Status: ${res.status}, User: ${data.user?.email}`
      );
    }

    {
      const res = await fetch(`${baseUrl}/api/auth/me`);
      record(
        "GET /api/auth/me (No token)",
        res.status === 401,
        `Status: ${res.status}`
      );
    }

    // 5b. Admin Authentication
    let adminToken = "";
    {
      // Valid Admin Login
      const res = await fetch(`${baseUrl}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@mobilix.com",
          password: "admin123",
        }),
      });
      const data = await res.json();
      adminToken = data.token;
      record(
        "POST /api/auth/admin/login (Valid admin credentials)",
        res.status === 200 && data.status === "success" && !!data.token && data.admin?.role === "ADMIN",
        `Status: ${res.status}, Role: ${data.admin?.role}, Token received: ${!!data.token}`
      );
    }

    {
      // Admin Login with wrong password
      const res = await fetch(`${baseUrl}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@mobilix.com",
          password: "wrong_password",
        }),
      });
      const data = await res.json();
      record(
        "POST /api/auth/admin/login (Wrong password)",
        res.status === 401 && data.status === "error",
        `Status: ${res.status}, Message: "${data.message}"`
      );
    }

    {
      // Admin Profile GET /api/auth/admin/me with Admin Token
      const res = await fetch(`${baseUrl}/api/auth/admin/me`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      record(
        "GET /api/auth/admin/me (With Admin Token)",
        res.status === 200 && data.admin?.email === "admin@mobilix.com",
        `Status: ${res.status}, Admin Email: ${data.admin?.email}`
      );
    }

    {
      // Admin Profile GET /api/auth/admin/me with Customer Token (Should be 403 Forbidden)
      const res = await fetch(`${baseUrl}/api/auth/admin/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      record(
        "GET /api/auth/admin/me (With Customer Token -> Forbidden)",
        res.status === 403 && data.status === "error",
        `Status: ${res.status}, Message: "${data.message}"`
      );
    }

    // 6. Booking creation
    let createdTicketNumber = "";
    let createdPhoneNumber = "0712345678";
    {
      // Valid booking with paymentType="now"
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: "local",
          firstName: "John",
          lastName: "Doe",
          startingPoint: "Nairobi",
          destination: "Mombasa",
          travelDate: "2026-11-15",
          seats: 2,
          paymentType: "now",
          mpesaNumber: createdPhoneNumber,
        }),
      });
      const data = await res.json();
      createdTicketNumber = data.ticket?.ticketNumber;
      record(
        "POST /api/bookings (Valid booking 'now')",
        res.status === 201 && data.status === "success" && !!data.ticket && data.ticket.amount === 1000,
        `Status: ${res.status}, Ticket: ${createdTicketNumber}, Amount: ${data.ticket?.amount}, Status: ${data.booking?.status}`
      );
    }

    {
      // Booking with paymentType="arrival"
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: "local",
          firstName: "Jane",
          lastName: "Smith",
          startingPoint: "Kisumu",
          destination: "Nakuru",
          travelDate: "2026-11-20",
          seats: 1,
          paymentType: "arrival",
          mpesaNumber: "0798765432",
        }),
      });
      const data = await res.json();
      record(
        "POST /api/bookings (Pay on arrival)",
        res.status === 201 && data.ticket?.mpesaRefCode === "PAYMENT ON ARRIVAL",
        `Status: ${res.status}, Ref: ${data.ticket?.mpesaRefCode}`
      );
    }

    {
      // Edge case: Missing startingPoint / destination
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: "local",
          firstName: "Incomplete",
          lastName: "Request",
          travelDate: "2026-11-20",
        }),
      });
      const data = await res.json();
      record(
        "POST /api/bookings (Missing startingPoint validation)",
        res.status === 400,
        `Status: ${res.status}, Returned: ${JSON.stringify(data)} (Controller crashes with 500 when startingPoint is undefined)`
      );
    }

    {
      // Edge case: Invalid seats value "abc"
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: "local",
          firstName: "Alice",
          lastName: "InvalidSeats",
          startingPoint: "Eldoret",
          destination: "Nairobi",
          travelDate: "2026-11-20",
          seats: "abc",
        }),
      });
      const data = await res.json();
      record(
        "POST /api/bookings (Invalid seats 'abc')",
        res.status === 400,
        `Status: ${res.status}, Returned: ${JSON.stringify(data)}`
      );
    }

    // 7. Tickets Listing & Search
    {
      const res = await fetch(`${baseUrl}/api/tickets`);
      const data = await res.json();
      record(
        "GET /api/tickets (List all tickets)",
        res.status === 200 && Array.isArray(data.tickets) && data.tickets.length >= 2,
        `Status: ${res.status}, Count: ${data.tickets?.length}`
      );
    }

    {
      const res = await fetch(`${baseUrl}/api/tickets/search?query=${createdTicketNumber}`);
      const data = await res.json();
      record(
        "GET /api/tickets/search (By ticketNumber)",
        res.status === 200 && data.ticket?.ticketNumber === createdTicketNumber,
        `Status: ${res.status}, Ticket: ${data.ticket?.ticketNumber}`
      );
    }

    {
      const res = await fetch(`${baseUrl}/api/tickets/search?query=${createdPhoneNumber}`);
      const data = await res.json();
      record(
        "GET /api/tickets/search (By phoneNumber)",
        res.status === 200 && data.ticket?.phoneNumber === createdPhoneNumber,
        `Status: ${res.status}, Found Passenger: ${data.ticket?.passengerName}`
      );
    }

    {
      const res = await fetch(`${baseUrl}/api/tickets/search`);
      const data = await res.json();
      record(
        "GET /api/tickets/search (No query param)",
        res.status === 400 && data.status === "error",
        `Status: ${res.status}, Message: "${data.message}"`
      );
    }

    {
      const res = await fetch(`${baseUrl}/api/tickets/search?query=NON_EXISTENT_TICKET`);
      const data = await res.json();
      record(
        "GET /api/tickets/search (Non-existent query)",
        res.status === 404 && data.status === "error",
        `Status: ${res.status}, Message: "${data.message}"`
      );
    }

    // 8. CORS Preflight
    {
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:5173",
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type, Authorization",
        },
      });
      const allowOrigin = res.headers.get("access-control-allow-origin");
      record(
        "OPTIONS /api/bookings (CORS Preflight)",
        res.status === 204 && allowOrigin === "http://localhost:5173",
        `Status: ${res.status}, Allow-Origin: ${allowOrigin}`
      );
    }

  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    server.close();
    await prisma.$disconnect();
    console.log(`\n========================================`);
    console.log(`SUMMARY: ${results.filter(r => r.passed).length}/${results.length} PASSED, ${results.filter(r => !r.passed).length} FAILED`);
    console.log(`========================================\n`);
  }
}

run();
