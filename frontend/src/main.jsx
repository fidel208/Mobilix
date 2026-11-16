import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Services from "./pages/services/Services";
import Contact from "./pages/contact/Contact";
import Tickets from "./pages/tickets/Tickets";
import Booking from "./pages/booking/Booking";
import NotFound from "./pages/notFound/NotFound";
import Admin from "./pages/admin/admin-dashboard/Admin";
import Login from "./pages/admin/admin-auth/Login";
import Dashboard from "./sections/dashboard/Dashboard";
import AdminServices from "./sections/services/AdminServices";
import AdminRoutes from "./sections/routes/AdminRoutes";
import Vehicles from "./sections/vehicles/Vehicles";
import AdminTickets from "./sections/tickets/AdminTickets";
import Community from "./sections/community/Community";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/services", element: <Services /> },
  { path: "/tickets", element: <Tickets /> },
  { path: "/contact", element: <Contact /> },
  { path: "/booking", element: <Booking /> },
  { path: "/login", element: <Navigate to="/admin/portal/auth" replace /> },
  { path: "/admin/portal/auth", element: <Login /> },
  {
    path: "/admin/portal",
    element: (
      <ProtectedAdminRoute>
        <Admin />
      </ProtectedAdminRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "services",
        element: <AdminServices />,
      },
      {
        path: "routes",
        element: <AdminRoutes />,
      },
      {
        path: "vehicles",
        element: <Vehicles />,
      },
      {
        path: "tickets",
        element: <AdminTickets />,
      },
      {
        path: "community",
        element: <Community />,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
