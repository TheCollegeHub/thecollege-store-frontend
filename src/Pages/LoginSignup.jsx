import React, { useState } from "react";
import { Alert, AlertTitle } from "@mui/material";
import "./CSS/LoginSignup.css";
import { backend_url } from "../App"

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [alertMessage, setAlertMessage] = useState(null);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${backend_url}/api/login`, {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAlertMessage(errorData.errors);
      } else {
        const data = await response.json();
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("user-id", data.id);
        window.location.replace("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAlertMessage(["Error during login. Please try again."]);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${backend_url}/api/signup`, {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAlertMessage(errorData.errors);
      } else {
        const data = await response.json();
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("user-id", data.id);
        window.location.replace("/");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setAlertMessage(["Error during signup. Please try again."]);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        {alertMessage && (
          <Alert data-qa-locator="alert-error" severity="error">
            <AlertTitle>Error</AlertTitle>
              <div data-qa-locator="alert-error-message">{alertMessage}</div>
          </Alert>
        )}

        <div className="loginsignup-fields">
          {state === "Sign Up" && <input data-qa-locator="input-name" type="text" placeholder="Your name" name="username" value={formData.username} onChange={changeHandler} />}
          <input data-qa-locator="input-email" type="email" placeholder="Email address" name="email" value={formData.email} onChange={changeHandler} />
          <input data-qa-locator="input-passord" type="password" placeholder="Password" name="password" value={formData.password} onChange={changeHandler} />
        </div>

        <button data-qa-locator="continue-button" onClick={state === "Login" ? handleLogin : handleSignup}>Continue</button>

        {state === "Login" ? (
          <p className="loginsignup-login">
            Create an account? <span  data-qa-locator="register-link" onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Already have an account? <span data-qa-locator="login-link" onClick={() => setState("Login")}>Login here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
