import { useEffect, useState } from "react";
import "./booking.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { Link } from "react-router-dom";
import API from "../../services/api";

function Booking() {
  const vehicleTypeMap = {
    local: "local-transit",
    private: "private-booking",
    luggage: "carrier",
    hire: "car-hire",
  };

  const [type, setType] = useState("local");
  const [days, setDays] = useState("one");
  const [localPayTime, setLocalPayTime] = useState("now");

  const [localBookingModal, setLocalBookingModal] = useState(false);
  const [privateBookingModal, setPrivateBookingModal] = useState(false);
  const [hireModal, setHireModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [vehiclesError, setVehiclesError] = useState("");
  const [routesError, setRoutesError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    selectedRouteId: "",
    startingPoint: "",
    destination: "",
    price: 0,
    date: "",
    seats: 1,
    selectedVehicleId: "",
    hireVehicleId: "",
    mpesaNumber: "",
  });

  const normalizeVehicleServiceType = (serviceType) => {
    const normalized = String(serviceType || "")
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, "-");

    if (["local", "local-transit", "transit"].includes(normalized)) {
      return "local-transit";
    }
    if (
      ["private", "private-booking", "private-bookings"].includes(normalized)
    ) {
      return "private-booking";
    }
    if (["carrier", "luggage", "cargo"].includes(normalized)) {
      return "carrier";
    }
    if (["hire", "car-hire", "rent"].includes(normalized)) {
      return "car-hire";
    }
    return normalized;
  };

  const formatVehicleLabel = (vehicle) => `${vehicle.name} (${vehicle.plate})`;

  const vehiclesByServiceType = {
    local: vehicles.filter(
      (vehicle) =>
        normalizeVehicleServiceType(vehicle.serviceType) ===
        vehicleTypeMap.local,
    ),
    private: vehicles.filter(
      (vehicle) =>
        normalizeVehicleServiceType(vehicle.serviceType) ===
        vehicleTypeMap.private,
    ),
    luggage: vehicles.filter(
      (vehicle) =>
        normalizeVehicleServiceType(vehicle.serviceType) ===
        vehicleTypeMap.luggage,
    ),
    hire: vehicles.filter(
      (vehicle) =>
        normalizeVehicleServiceType(vehicle.serviceType) ===
        vehicleTypeMap.hire,
    ),
  };

  const routesByServiceType = {
    local: routes.filter(
      (r) =>
        normalizeVehicleServiceType(r.serviceType) === vehicleTypeMap.local,
    ),
    private: routes.filter(
      (r) =>
        normalizeVehicleServiceType(r.serviceType) === vehicleTypeMap.private,
    ),
    luggage: routes.filter(
      (r) =>
        normalizeVehicleServiceType(r.serviceType) === vehicleTypeMap.luggage,
    ),
    hire: routes.filter(
      (r) => normalizeVehicleServiceType(r.serviceType) === vehicleTypeMap.hire,
    ),
  };

  const fetchVehicles = async () => {
    setVehiclesLoading(true);
    setVehiclesError("");
    try {
      const response = await API.get("/vehicles");
      setVehicles(response.data?.vehicles || []);
    } catch (err) {
      setVehiclesError("Unable to load vehicles right now.");
      console.error("Failed to fetch booking vehicles:", err);
    } finally {
      setVehiclesLoading(false);
    }
  };

  const fetchRoutes = async () => {
    setRoutesLoading(true);
    setRoutesError("");
    try {
      const response = await API.get("/routes");
      setRoutes(response.data?.routes || []);
    } catch (err) {
      setRoutesError("Unable to load routes right now.");
      console.error("Failed to fetch booking routes:", err);
    } finally {
      setRoutesLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchRoutes();
  }, []);

  useEffect(() => {
    const currentServiceVehicles =
      type === "hire"
        ? vehiclesByServiceType.hire
        : vehiclesByServiceType[type] || [];

    if (type === "hire") {
      if (
        currentServiceVehicles.length > 0 &&
        !currentServiceVehicles.some((v) => v.id === formData.hireVehicleId)
      ) {
        setFormData((prev) => ({
          ...prev,
          hireVehicleId: currentServiceVehicles[0].id,
        }));
      }
    } else {
      if (
        currentServiceVehicles.length > 0 &&
        !currentServiceVehicles.some((v) => v.id === formData.selectedVehicleId)
      ) {
        setFormData((prev) => ({
          ...prev,
          selectedVehicleId: currentServiceVehicles[0].id,
        }));
      }
    }
  }, [type, vehicles]);

  useEffect(() => {
    const currentServiceRoutes = routesByServiceType[type] || [];
    if (
      currentServiceRoutes.length > 0 &&
      !currentServiceRoutes.some((r) => r.id === formData.selectedRouteId)
    ) {
      const defaultRoute = currentServiceRoutes[0];
      setFormData((prev) => ({
        ...prev,
        selectedRouteId: defaultRoute.id,
        startingPoint: defaultRoute.startingPoint,
        destination: defaultRoute.destination,
        price: defaultRoute.price,
      }));
    } else if (currentServiceRoutes.length === 0 && type !== "hire") {
      setFormData((prev) => ({
        ...prev,
        selectedRouteId: "",
        startingPoint: "",
        destination: "",
        price: 0,
      }));
    }
  }, [type, routes]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRouteChange = (e) => {
    const routeId = e.target.value;
    const selected = routes.find((r) => r.id === routeId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        selectedRouteId: routeId,
        startingPoint: selected.startingPoint,
        destination: selected.destination,
        price: selected.price,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedRouteId: "",
        startingPoint: "",
        destination: "",
        price: 0,
      }));
    }
  };

  const handleType = (e) => setType(e.target.value);
  const handleDays = (e) => setDays(e.target.value);

  const handleLocalBooking = () => {
    setLocalBookingModal(!localBookingModal);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handlePrivateBooking = () => {
    setPrivateBookingModal(!privateBookingModal);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleHire = () => {
    setHireModal(!hireModal);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const selectedVehicle = vehicles.find((v) =>
    type === "hire"
      ? v.id === formData.hireVehicleId
      : v.id === formData.selectedVehicleId,
  );

  const selectedRoute = routes.find((r) => r.id === formData.selectedRouteId);

  const handleBookingSubmit = async (e, serviceType) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const selectedVehicleId =
        serviceType === "hire"
          ? formData.hireVehicleId
          : formData.selectedVehicleId;

      const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
      if (!vehicle) {
        setLoading(false);
        setErrorMsg("Please select a vehicle before booking.");
        return;
      }

      if (serviceType !== "hire") {
        const route = routes.find((r) => r.id === formData.selectedRouteId);
        if (!route) {
          setLoading(false);
          setErrorMsg("Please select a route before booking.");
          return;
        }
      }

      if (!formData.email || !formData.email.includes("@")) {
        setLoading(false);
        setErrorMsg("Please provide a valid email address for confirmation.");
        return;
      }

      const payload = {
        serviceType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        routeId: formData.selectedRouteId || null,
        startingPoint:
          formData.startingPoint ||
          (serviceType === "hire" ? "Hire Station" : "N/A"),
        destination:
          formData.destination ||
          (serviceType === "hire" ? "Self Drive" : "N/A"),
        travelDate: formData.date,
        seats: Number(formData.seats) || 1,
        vehicleId: vehicle.id,
        carType: formatVehicleLabel(vehicle),
        paymentType:
          serviceType === "local"
            ? localPayTime === "later"
              ? "arrival"
              : "now"
            : "now",
        mpesaNumber: formData.mpesaNumber,
      };

      const response = await API.post("/bookings", payload);

      if (response.data.requiresPayment && response.data.checkoutRequestId) {
        const checkoutId = response.data.checkoutRequestId;
        setSuccessMsg(
          "M-Pesa STK prompt sent to your phone! Please enter your M-Pesa PIN to complete payment.",
        );

        let attempts = 0;
        const maxAttempts = 15;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const checkRes = await API.get(`/mpesa/status/${checkoutId}`);
            if (checkRes.data?.paid) {
              clearInterval(interval);
              setSuccessMsg(
                `Payment confirmed! M-Pesa Ref: ${checkRes.data.mpesaRefCode || "CONFIRMED"}. Ticket: ${checkRes.data.ticketNumber || response.data.ticket?.ticketNumber}`,
              );
              setLoading(false);
              setTimeout(() => {
                setLocalBookingModal(false);
                setPrivateBookingModal(false);
                setHireModal(false);
                setSuccessMsg("");
              }, 4000);
            } else if (checkRes.data?.status === "failed") {
              clearInterval(interval);
              setErrorMsg(
                checkRes.data.message ||
                  "M-Pesa payment was cancelled or failed. Please try again.",
              );
              setLoading(false);
            } else if (attempts >= maxAttempts) {
              clearInterval(interval);
              setSuccessMsg(
                "Payment prompt initiated. Your ticket will be updated once your M-Pesa transaction clears.",
              );
              setLoading(false);
              setTimeout(() => {
                setLocalBookingModal(false);
                setPrivateBookingModal(false);
                setHireModal(false);
                setSuccessMsg("");
              }, 4000);
            }
          } catch (pollErr) {
            console.error("M-Pesa status polling error:", pollErr);
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              setLoading(false);
            }
          }
        }, 3000);
        return;
      }

      setSuccessMsg(
        response.data.message ||
          "Booking successful! Ticket confirmation has been sent to your email and you have been added to the community.",
      );
      setLoading(false);

      setTimeout(() => {
        setLocalBookingModal(false);
        setPrivateBookingModal(false);
        setHireModal(false);
        setSuccessMsg("");
      }, 3000);
    } catch (err) {
      setLoading(false);
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to complete booking. Please try again.",
      );
    }
  };

  return (
    <>
      <Header />
      <div className="booking">
        <h1>BOOKING</h1>
        <div className="ticket-booking">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="service-type">
              <span>
                <input
                  type="radio"
                  name="type"
                  id="local"
                  value="local"
                  checked={type === "local"}
                  onChange={handleType}
                />
                <label htmlFor="local">Local transit</label>
              </span>
              <span>
                <input
                  type="radio"
                  name="type"
                  id="private"
                  value="private"
                  checked={type === "private"}
                  onChange={handleType}
                />
                <label htmlFor="private">Private booking</label>
              </span>
              <span>
                <input
                  type="radio"
                  name="type"
                  id="luggage"
                  value="luggage"
                  checked={type === "luggage"}
                  onChange={handleType}
                />
                <label htmlFor="luggage">Carrier services</label>
              </span>
            </div>

            {type === "local" && (
              <div className="local-div">
                <p>
                  {vehiclesLoading || routesLoading
                    ? "Loading available options..."
                    : `${vehiclesByServiceType.local.length} vehicles and ${routesByServiceType.local.length} routes available`}
                </p>

                {vehiclesByServiceType.local.length === 0 &&
                  !vehiclesLoading && (
                    <p
                      style={{
                        color: "#d97706",
                        fontSize: "14px",
                        margin: "4px 0",
                      }}
                    >
                      No vehicles available.
                    </p>
                  )}

                {routesByServiceType.local.length === 0 && !routesLoading && (
                  <p
                    style={{
                      color: "#d97706",
                      fontSize: "14px",
                      margin: "4px 0",
                    }}
                  >
                    No routes added available.
                  </p>
                )}

                <div className="inputs">
                  <span>
                    <label htmlFor="local-vehicle">Vehicle</label>
                    <select
                      name="selectedVehicleId"
                      id="local-vehicle"
                      value={formData.selectedVehicleId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select vehicle</option>
                      {vehiclesByServiceType.local.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {formatVehicleLabel(vehicle)}
                        </option>
                      ))}
                    </select>
                  </span>

                  <span>
                    <label htmlFor="local-route">Route</label>
                    <select
                      name="selectedRouteId"
                      id="local-route"
                      value={formData.selectedRouteId}
                      onChange={handleRouteChange}
                      required
                    >
                      <option value="">Select route</option>
                      {routesByServiceType.local.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.startingPoint} - {r.destination} (KES {r.price})
                        </option>
                      ))}
                    </select>
                  </span>

                  <span>
                    <label htmlFor="local-date">Date</label>
                    <input
                      type="date"
                      name="date"
                      id="local-date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </span>
                </div>
                <div className="form-buttons">
                  <button type="submit">Search for seats</button>
                  <button
                    type="button"
                    onClick={handleLocalBooking}
                    id="book-button"
                    disabled={
                      vehiclesByServiceType.local.length === 0 ||
                      routesByServiceType.local.length === 0 ||
                      vehiclesLoading ||
                      routesLoading
                    }
                  >
                    Get a ticket
                  </button>
                </div>
              </div>
            )}

            {}
            {type === "private" && (
              <div className="private-div">
                <p>
                  {vehiclesLoading || routesLoading
                    ? "Loading available options..."
                    : `${vehiclesByServiceType.private.length} vehicles and ${routesByServiceType.private.length} routes available`}
                </p>

                {vehiclesByServiceType.private.length === 0 &&
                  !vehiclesLoading && (
                    <p
                      style={{
                        color: "#d97706",
                        fontSize: "14px",
                        margin: "4px 0",
                      }}
                    >
                      No vehicles available.
                    </p>
                  )}

                {routesByServiceType.private.length === 0 && !routesLoading && (
                  <p
                    style={{
                      color: "#d97706",
                      fontSize: "14px",
                      margin: "4px 0",
                    }}
                  >
                    No routes available.
                  </p>
                )}

                <div className="inputs">
                  <span>
                    <label htmlFor="private-vehicle">Vehicle</label>
                    <select
                      name="selectedVehicleId"
                      id="private-vehicle"
                      value={formData.selectedVehicleId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select vehicle</option>
                      {vehiclesByServiceType.private.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {formatVehicleLabel(vehicle)}
                        </option>
                      ))}
                    </select>
                  </span>

                  <span>
                    <label htmlFor="private-route">Route</label>
                    <select
                      name="selectedRouteId"
                      id="private-route"
                      value={formData.selectedRouteId}
                      onChange={handleRouteChange}
                      required
                    >
                      <option value="">Select route</option>
                      {routesByServiceType.private.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.startingPoint} - {r.destination} (KES {r.price})
                        </option>
                      ))}
                    </select>
                  </span>

                  <span>
                    <label htmlFor="private-date">Date</label>
                    <input
                      type="date"
                      name="date"
                      id="private-date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </span>
                </div>
                <div className="form-buttons">
                  <button type="submit">Search for cars</button>
                  <button
                    type="button"
                    id="book-button"
                    onClick={handlePrivateBooking}
                    disabled={
                      vehiclesByServiceType.private.length === 0 ||
                      routesByServiceType.private.length === 0 ||
                      vehiclesLoading ||
                      routesLoading
                    }
                  >
                    Reserve a seat
                  </button>
                </div>
              </div>
            )}

            {}
            {type === "luggage" && (
              <div className="luggage-div">
                <p>
                  {vehiclesLoading || routesLoading
                    ? "Loading available options..."
                    : `${vehiclesByServiceType.luggage.length} vehicles and ${routesByServiceType.luggage.length} routes available`}
                </p>

                {vehiclesByServiceType.luggage.length === 0 &&
                  !vehiclesLoading && (
                    <p
                      style={{
                        color: "#d97706",
                        fontSize: "14px",
                        margin: "4px 0",
                      }}
                    >
                      No vehicles available.
                    </p>
                  )}

                {routesByServiceType.luggage.length === 0 && !routesLoading && (
                  <p
                    style={{
                      color: "#d97706",
                      fontSize: "14px",
                      margin: "4px 0",
                    }}
                  >
                    No routes available.
                  </p>
                )}

                <div className="inputs">
                  <span>
                    <label htmlFor="luggage-vehicle">Vehicle</label>
                    <select
                      name="selectedVehicleId"
                      id="luggage-vehicle"
                      value={formData.selectedVehicleId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select vehicle</option>
                      {vehiclesByServiceType.luggage.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {formatVehicleLabel(vehicle)}
                        </option>
                      ))}
                    </select>
                  </span>

                  <span>
                    <label htmlFor="luggage-route">Route</label>
                    <select
                      name="selectedRouteId"
                      id="luggage-route"
                      value={formData.selectedRouteId}
                      onChange={handleRouteChange}
                      required
                    >
                      <option value="">Select route</option>
                      {routesByServiceType.luggage.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.startingPoint} - {r.destination} (KES {r.price})
                        </option>
                      ))}
                    </select>
                  </span>

                  <span>
                    <label htmlFor="luggage-date">Date</label>
                    <input
                      type="date"
                      name="date"
                      id="luggage-date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </span>
                </div>
                <button
                  type="button"
                  id="luggage-book-btn"
                  onClick={handleLocalBooking}
                  disabled={
                    vehiclesByServiceType.luggage.length === 0 ||
                    routesByServiceType.luggage.length === 0 ||
                    vehiclesLoading ||
                    routesLoading
                  }
                >
                  Book carrier
                </button>
              </div>
            )}
          </form>

          {(vehiclesError || routesError) && (
            <p style={{ color: "red", marginTop: "8px" }}>
              {vehiclesError || routesError}
            </p>
          )}

          {}
          {localBookingModal && (
            <div className="booking-modal">
              <form
                className="booking-container"
                onSubmit={(e) =>
                  handleBookingSubmit(
                    e,
                    type === "luggage" ? "luggage" : "local",
                  )
                }
              >
                <div className="modal-top">
                  <p>Complete Your Reservation</p>
                  <button type="button" onClick={handleLocalBooking}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                {successMsg && (
                  <p style={{ color: "green", fontWeight: "600" }}>
                    {successMsg}
                  </p>
                )}
                {errorMsg && (
                  <p style={{ color: "red", fontWeight: "600" }}>{errorMsg}</p>
                )}

                {}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    color: "#334155",
                  }}
                >
                  <div style={{ fontSize: "15px" }}>
                    Vehicle :&nbsp;
                    {selectedVehicle
                      ? formatVehicleLabel(selectedVehicle)
                      : "None selected"}
                  </div>
                  {selectedRoute && (
                    <div style={{ fontSize: "15px" }}>
                      Route :&nbsp;{selectedRoute.startingPoint} -
                      {selectedRoute.destination} - (KES {selectedRoute.price} /
                      seat)
                    </div>
                  )}
                  {formData.date && (
                    <div style={{ fontSize: "14px" }}>
                      Travel Date :&nbsp;{formData.date}
                    </div>
                  )}
                  {formData.seats > 0 && selectedRoute && (
                    <div
                      style={{
                        color: "#2563eb",
                        fontWeight: "700",
                        fontSize: "15px",
                      }}
                    >
                      Estimated Total: KES :&nbsp;
                      {(
                        selectedRoute.price * (Number(formData.seats) || 1)
                      ).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="details-form">
                  <div className="names">
                    <span>
                      <label htmlFor="first-name">First name</label>
                      <input
                        type="text"
                        name="firstName"
                        id="first-name"
                        placeholder="Eg. John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="last-name">Last name</label>
                      <input
                        type="text"
                        name="lastName"
                        id="last-name"
                        placeholder="Eg. Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                  </div>

                  <div id="email-div">
                    <label htmlFor="local-email">Email address</label>
                    <input
                      type="email"
                      name="email"
                      id="local-email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="date">
                    <span>
                      <label htmlFor="seats">No of seats</label>
                      <input
                        type="number"
                        name="seats"
                        id="seats"
                        placeholder="Eg. 1"
                        min={1}
                        value={formData.seats}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                  </div>

                  <div className="payment-choose">
                    <span>
                      <input
                        type="radio"
                        name="pay-time"
                        id="pay-now"
                        value="now"
                        checked={localPayTime === "now"}
                        onChange={() => setLocalPayTime("now")}
                      />
                      <label htmlFor="pay-now">Pay now</label>
                    </span>
                    <span>
                      <input
                        type="radio"
                        name="pay-time"
                        id="pay-later"
                        value="later"
                        checked={localPayTime === "later"}
                        onChange={() => setLocalPayTime("later")}
                      />
                      <label htmlFor="pay-later">Pay on pickup</label>
                    </span>
                  </div>
                </div>

                {localPayTime === "now" && (
                  <div className="stk">
                    <span>
                      <label htmlFor="mpesa-number">M-Pesa phone number</label>
                      <input
                        type="text"
                        name="mpesaNumber"
                        id="mpesa-number"
                        placeholder="Eg. 0712345678"
                        value={formData.mpesaNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                    <button type="submit" disabled={loading}>
                      {loading ? "Processing..." : "Confirm and Pay"}
                    </button>
                  </div>
                )}

                {localPayTime === "later" && (
                  <button id="book-now-btn" type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Confirm Booking"}
                  </button>
                )}
              </form>
            </div>
          )}

          {}
          {privateBookingModal && (
            <div className="booking-modal">
              <form
                className="booking-container"
                onSubmit={(e) => handleBookingSubmit(e, "private")}
              >
                <div className="modal-top">
                  <p>Complete Private Booking</p>
                  <button type="button" onClick={handlePrivateBooking}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                {successMsg && (
                  <p
                    style={{
                      color: "green",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {successMsg}
                  </p>
                )}
                {errorMsg && (
                  <p
                    style={{
                      color: "red",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {errorMsg}
                  </p>
                )}

                {}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    color: "#334155",
                  }}
                >
                  <div style={{ fontSize: "15px" }}>
                    Vehicle :&nbsp;
                    {selectedVehicle
                      ? formatVehicleLabel(selectedVehicle)
                      : "None selected"}
                  </div>
                  {selectedRoute && (
                    <div style={{ fontSize: "15px" }}>
                      Route: {selectedRoute.startingPoint} -
                      {selectedRoute.destination} (KES {selectedRoute.price})
                    </div>
                  )}
                  {formData.date && (
                    <div style={{ fontSize: "15px" }}>
                      Travel Date :&nbsp;{formData.date}
                    </div>
                  )}
                  {selectedRoute && (
                    <div
                      style={{
                        color: "#2563eb",
                        fontWeight: "700",
                        fontSize: "15px",
                      }}
                    >
                      Estimated Total: KES :&nbsp;
                      {(
                        selectedRoute.price * (Number(formData.seats) || 1)
                      ).toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="details-form">
                  <div className="names">
                    <span>
                      <label htmlFor="p-first">First name</label>
                      <input
                        type="text"
                        name="firstName"
                        id="p-first"
                        placeholder="Eg. John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="p-last">Last name</label>
                      <input
                        type="text"
                        name="lastName"
                        id="p-last"
                        placeholder="Eg. Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                  </div>

                  <div id="email-div">
                    <label htmlFor="private-email">Email address</label>
                    <input
                      type="email"
                      name="email"
                      id="private-email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="date">
                    <span>
                      <label htmlFor="p-seats">No of seats</label>
                      <input
                        type="number"
                        name="seats"
                        id="p-seats"
                        min={1}
                        value={formData.seats}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                  </div>

                  <div className="stk">
                    <span>
                      <label htmlFor="p-mpesa">M-Pesa phone number</label>
                      <input
                        type="text"
                        name="mpesaNumber"
                        id="p-mpesa"
                        placeholder="Eg. 0712345678"
                        value={formData.mpesaNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                    <button type="submit" disabled={loading}>
                      {loading ? "Processing..." : "Confirm and Pay"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {}
        <div className="car-hire-booking">
          <h1>Rent a car</h1>
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="hire-div">
              <span>
                <label htmlFor="car-type">Car type</label>
                <select
                  name="hireVehicleId"
                  id="car-type"
                  value={formData.hireVehicleId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select vehicle</option>
                  {vehiclesByServiceType.hire.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {formatVehicleLabel(vehicle)}
                    </option>
                  ))}
                </select>
              </span>
              <span>
                <label htmlFor="days">Days</label>
                <select
                  name="days"
                  id="days"
                  value={days}
                  onChange={handleDays}
                  required
                >
                  <option value="one">One day</option>
                  <option value="more">More than a day</option>
                </select>
              </span>
              <div>
                <span>
                  <label htmlFor="hire-date">Date</label>
                  <input
                    type="date"
                    name="date"
                    id="hire-date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </span>
              </div>
            </div>

            {vehiclesByServiceType.hire.length === 0 && !vehiclesLoading && (
              <p
                style={{ color: "#d97706", fontSize: "14px", margin: "4px 0" }}
              >
                No vehicles available.
              </p>
            )}

            <div className="form-buttons">
              <button type="submit">Search for cars</button>
              <button
                type="button"
                onClick={handleHire}
                id="book-button"
                disabled={
                  vehiclesByServiceType.hire.length === 0 || vehiclesLoading
                }
              >
                Hire a car
              </button>
            </div>
          </form>

          {}
          {hireModal && (
            <div className="hire-modal">
              <form
                className="hire-container"
                onSubmit={(e) => handleBookingSubmit(e, "hire")}
              >
                <div className="modal-top">
                  <p>Complete Car Rental</p>
                  <button type="button" onClick={handleHire}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                {successMsg && (
                  <p style={{ color: "green", fontWeight: "600" }}>
                    {successMsg}
                  </p>
                )}
                {errorMsg && (
                  <p style={{ color: "red", fontWeight: "600" }}>{errorMsg}</p>
                )}

                {}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    color: "#334155",
                  }}
                >
                  <div style={{ fontSize: "15px" }}>
                    Vehicle :&nbsp;
                    {selectedVehicle
                      ? formatVehicleLabel(selectedVehicle)
                      : "None selected"}
                  </div>
                  <div style={{ fontSize: "15px" }}>
                    Rental Period :&nbsp;
                    {days === "one" ? "1 Day" : "More than one days"}
                  </div>
                  {formData.date && (
                    <div style={{ fontSize: "15px" }}>
                      Start Date :&nbsp;{formData.date}
                    </div>
                  )}
                </div>

                <div className="details-form">
                  <div className="names">
                    <span>
                      <label htmlFor="h-first">First name</label>
                      <input
                        type="text"
                        name="firstName"
                        id="h-first"
                        placeholder="Eg. John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="h-last">Last name</label>
                      <input
                        type="text"
                        name="lastName"
                        id="h-last"
                        placeholder="Eg. Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                  </div>

                  <div id="email-div">
                    <label htmlFor="hire-email">Email address</label>
                    <input
                      type="email"
                      name="email"
                      id="hire-email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="stk">
                    <span>
                      <label htmlFor="h-mpesa">M-Pesa phone number</label>
                      <input
                        type="text"
                        name="mpesaNumber"
                        id="h-mpesa"
                        placeholder="Eg. 0712345678"
                        value={formData.mpesaNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                    <button type="submit" disabled={loading}>
                      {loading ? "Processing..." : "Confirm and Pay"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Booking;
