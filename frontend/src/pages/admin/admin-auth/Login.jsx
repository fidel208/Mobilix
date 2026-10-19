import React from "react";
import "./login.css";

function Login() {
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
            <form>
              <div className="auth-div">
                <label htmlFor="admin-email">Email address</label>
                <span>
                  <span className="material-symbols-outlined">mail</span>
                  <input
                    type="email"
                    name="admin-email"
                    id="admin-email"
                    placeholder="your@email.com"
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
                    required
                  />
                </span>
              </div>
              <button type="submit">
                <span className="material-symbols-outlined">login</span>Sign in
                to the platform
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
