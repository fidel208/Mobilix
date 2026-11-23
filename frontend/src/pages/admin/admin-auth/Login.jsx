import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/admin/login", {
        email: email.trim(),
        password,
      });

      const { token, admin } = response.data;
      localStorage.setItem("mobilix_token", token);
      localStorage.setItem("mobilix_admin", JSON.stringify(admin));

      setLoading(false);
      navigate("/admin/portal/dashboard");
    } catch (err) {
      setLoading(false);
      setPassword("");
      if (!err.response) {
        setError("Cannot connect to server.");
      } else {
        setError(err.response?.data?.message || "Invalid email or password.");
      }
    }
  };

  return (
    <>
      <div className="admin-auth">
        <div className="auth-container">
          <div className="auth-top">
            <span className="logo-span"></span>
            <h1>Welcome to Mobilix</h1>
            <p>An online booking platform</p>
          </div>
          <div className="form-container">
            <div className="form-top">
              <h2>Admin portal</h2>
              <p>Enter your credentials to access the platform</p>
            </div>

            {error && (
              <p
                style={{
                  color: "#d9534f",
                  backgroundColor: "#fdf2f2",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #f5c6cb",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            <form onSubmit={handleAdminLogin}>
              <div className="auth-div">
                <label htmlFor="admin-email">Email address</label>
                <span>
                  <span className="material-symbols-outlined">mail</span>
                  <input
                    type="email"
                    name="admin-email"
                    id="admin-email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </span>
              </div>
              <div className="auth-div">
                <label htmlFor="admin-pass">Password</label>
                <span>
                  <span className="material-symbols-outlined">lock</span>
                  <input
                    type="password"
                    name="admin-pass"
                    id="admin-pass"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </span>
              </div>
              <button type="submit" disabled={loading}>
                <span className="material-symbols-outlined">login</span>
                {loading ? "Signing in..." : "Sign in to the platform"}
              </button>
            </form>
            <p>Need access? Contact the head office</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
