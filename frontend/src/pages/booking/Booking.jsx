import React, { useEffect, useState } from "react";
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
  const [vehiclesError, setVehiclesError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [vehicles, setVehicles] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    startingPoint: "kwale",
    destination: "kwale",
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

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (
      vehiclesByServiceType.hire.length > 0 &&
      !vehiclesByServiceType.hire.some(
        (vehicle) => vehicle.id === formData.hireVehicleId,
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        hireVehicleId: vehiclesByServiceType.hire[0].id,
      }));
    }
  }, [vehiclesByServiceType.hire, formData.hireVehicleId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      const selectedVehicle = vehicles.find(
        (vehicle) => vehicle.id === selectedVehicleId,
      );

      if (!selectedVehicle) {
        setLoading(false);
        setErrorMsg(
          "Please select a valid admin-added vehicle before booking.",
        );
        return;
      }

      const payload = {
        serviceType,
        firstName: formData.firstName,
        lastName: formData.lastName,
        startingPoint: formData.startingPoint,
        destination: formData.destination,
        travelDate: formData.date,
        seats: Number(formData.seats) || 1,
        vehicleId: selectedVehicle.id, // Securely passing database vehicle ID
        carType: formatVehicleLabel(selectedVehicle),
        paymentType:
          serviceType === "local"
            ? localPayTime === "later"
              ? "arrival"
              : "now"
            : "now",
        mpesaNumber: formData.mpesaNumber,
      };

      const response = await API.post("/bookings", payload);
      setSuccessMsg(response.data.message || "Booking processed successfully!");
      setLoading(false);

      setTimeout(() => {
        setLocalBookingModal(false);
        setPrivateBookingModal(false);
        setHireModal(false);
        setSuccessMsg("");
      }, 2500);
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || "Failed to complete booking.");
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
                  {vehiclesLoading
                    ? "Loading vehicles..."
                    : `${vehiclesByServiceType.local.length} vehicles available`}
                </p>
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
                    <label htmlFor="local-from">Starting point</label>
                    <select
                      name="startingPoint"
                      id="local-from"
                      onChange={handleInputChange}
                    >
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="local-to">Destination</label>
                    <select
                      name="destination"
                      id="local-to"
                      onChange={handleInputChange}
                    >
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="local-date">Date</label>
                    <input
                      type="date"
                      name="date"
                      id="local-date"
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
                      vehiclesLoading
                    }
                  >
                    Get a ticket
                  </button>
                </div>
              </div>
            )}

            {type === "private" && (
              <div className="private-div">
                <p>
                  {vehiclesLoading
                    ? "Loading vehicles..."
                    : `${vehiclesByServiceType.private.length} vehicles available`}
                </p>
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
                    <label htmlFor="private-from">Starting point</label>
                    <input
                      type="text"
                      name="startingPoint"
                      id="private-from"
                      placeholder="Eg. Kwale"
                      onChange={handleInputChange}
                      required
                    />
                  </span>
                  <span>
                    <label htmlFor="private-to">Destination</label>
                    <select
                      name="destination"
                      id="private-to"
                      onChange={handleInputChange}
                    >
                      <option value="airstrip">Ukunda airstrip</option>
                      <option value="airport">Moi Int airport</option>
                      <option value="sgr">Mombasa SGR station</option>
                    </select>
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
                      vehiclesLoading
                    }
                  >
                    Reserve a seat
                  </button>
                </div>
              </div>
            )}

            {type === "luggage" && (
              <div className="luggage-div">
                <p>
                  {vehiclesLoading
                    ? "Loading vehicles..."
                    : `${vehiclesByServiceType.luggage.length} vehicles available`}
                </p>
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
                    <label htmlFor="luggage-from">Starting point</label>
                    <select
                      name="startingPoint"
                      id="luggage-from"
                      onChange={handleInputChange}
                    >
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="luggage-to">Destination</label>
                    <select
                      name="destination"
                      id="luggage-to"
                      onChange={handleInputChange}
                    >
                      <option value="kwale">Kwale town</option>
                      <option value="kombani">Kombani</option>
                      <option value="ukunda">Ukunda</option>
                      <option value="likoni">Likoni</option>
                    </select>
                  </span>
                  <span>
                    <label htmlFor="luggage-date">Date</label>
                    <input
                      type="date"
                      name="date"
                      id="luggage-date"
                      onChange={handleInputChange}
                      required
                    />
                  </span>
                </div>
                <button
                  type="submit"
                  id="luggage-book-btn"
                  onClick={(e) => handleBookingSubmit(e, "luggage")}
                  disabled={
                    vehiclesByServiceType.luggage.length === 0 ||
                    vehiclesLoading
                  }
                >
                  Book now
                </button>
              </div>
            )}
          </form>

          {vehiclesError && (
            <p style={{ color: "red", marginTop: "8px" }}>{vehiclesError}</p>
          )}

          {localBookingModal && (
            <div className="booking-modal">
              <form
                className="booking-container"
                onSubmit={(e) => handleBookingSubmit(e, "local")}
              >
                <div className="modal-top">
                  <p>Fill the following form</p>
                  <button type="button" onClick={handleLocalBooking}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
                {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                <div className="details-form">
                  <div className="names">
                    <span>
                      <label htmlFor="first-name">First name</label>
                      <input
                        type="text"
                        name="firstName"
                        id="first-name"
                        placeholder="Enter your first name"
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
                        placeholder="Enter your last name"
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                  </div>
                  <div className="date">
                    <span>
                      <label htmlFor="date">Date</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="seats">No of seats</label>
                      <input
                        type="number"
                        name="seats"
                        id="seats"
                        placeholder="Eg. 1"
                        min={1}
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
                      <label htmlFor="mpesa-number">Mpesa number</label>
                      <input
                        type="text"
                        name="mpesaNumber"
                        id="mpesa-number"
                        placeholder="Eg. 0712345678"
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                    <button type="submit" disabled={loading}>
                      {loading ? "Initialising STK..." : "Initialise"}
                    </button>
                  </div>
                )}
                {localPayTime === "later" && (
                  <button id="book-now-btn" type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Book now"}
                  </button>
                )}
              </form>
            </div>
          )}

          {privateBookingModal && (
            <div className="booking-modal">
              <form
                className="booking-container"
                onSubmit={(e) => handleBookingSubmit(e, "private")}
              >
                <div className="modal-top">
                  <p>Fill the following form</p>
                  <button type="button" onClick={handlePrivateBooking}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
                {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                <div className="details-form">
                  <div className="names">
                    <span>
                      <label htmlFor="p-first">First name</label>
                      <input
                        type="text"
                        name="firstName"
                        id="p-first"
                        placeholder="Enter first name"
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
                        placeholder="Enter last name"
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                  </div>
                  <div className="date">
                    <span>
                      <label htmlFor="p-date">Date</label>
                      <input
                        type="date"
                        name="date"
                        id="p-date"
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                    <span>
                      <label htmlFor="p-seats">No of seats</label>
                      <input
                        type="number"
                        name="seats"
                        id="p-seats"
                        defaultValue={1}
                        min={1}
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                  </div>
                  <span className="agree-span">
                    <input
                      type="checkbox"
                      name="agree"
                      id="agree-private"
                      required
                    />
                    <label htmlFor="agree-private">
                      Agree to the{" "}
                      <Link to={"/private-booking/terms-and-conditions"}>
                        terms and conditions
                      </Link>
                    </label>
                  </span>
                  <div className="stk">
                    <span>
                      <label htmlFor="p-mpesa">Mpesa number</label>
                      <input
                        type="text"
                        name="mpesaNumber"
                        id="p-mpesa"
                        placeholder="Eg. 0712345678"
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                    <button type="submit" disabled={loading}>
                      {loading ? "Initialising STK..." : "Initialise"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

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
                {days === "one" && (
                  <span>
                    <label htmlFor="hire-date">Date</label>
                    <input
                      type="date"
                      name="date"
                      id="hire-date"
                      onChange={handleInputChange}
                      required
                    />
                  </span>
                )}
                {days === "more" && (
                  <div className="more-days">
                    <span>
                      <label htmlFor="from-hire">From</label>
                      <input
                        type="date"
                        name="date"
                        id="from-hire"
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                  </div>
                )}
              </div>
            </div>
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

          {hireModal && (
            <div className="hire-modal">
              <form
                className="hire-container"
                onSubmit={(e) => handleBookingSubmit(e, "hire")}
              >
                <div className="modal-top">
                  <p>Fill the following form</p>
                  <button type="button" onClick={handleHire}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
                {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                <div className="details-form">
                  <div className="names">
                    <span>
                      <label htmlFor="h-first">First name</label>
                      <input
                        type="text"
                        name="firstName"
                        id="h-first"
                        placeholder="Enter first name"
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
                        placeholder="Enter last name"
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                  </div>
                  <div className="date">
                    <span>
                      <label htmlFor="h-cartype">Car type</label>
                      <select
                        name="hireVehicleId"
                        id="h-cartype"
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
                      <label htmlFor="h-date">Date</label>
                      <input
                        type="date"
                        name="date"
                        id="h-date"
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                  </div>
                  <span className="agree-span">
                    <input
                      type="checkbox"
                      name="agree"
                      id="agree-hire"
                      required
                    />
                    <label htmlFor="agree-hire">
                      Agree to the{" "}
                      <Link to={"/car-hire/terms-and-conditions"}>
                        terms and conditions
                      </Link>
                    </label>
                  </span>
                  <div className="stk">
                    <span>
                      <label htmlFor="h-mpesa">Mpesa number</label>
                      <input
                        type="text"
                        name="mpesaNumber"
                        id="h-mpesa"
                        placeholder="Eg. 0712345678"
                        onChange={handleInputChange}
                        required
                      />
                    </span>
                    <button type="submit" disabled={loading}>
                      {loading ? "Initialising STK..." : "Initialise"}
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
