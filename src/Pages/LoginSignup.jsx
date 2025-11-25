import React, { useState } from "react";
import { Alert, AlertTitle } from "@mui/material";
import "./CSS/LoginSignup.css";
import { backend_url } from "../App"

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [alertMessage, setAlertMessage] = useState(null);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    // Check minimum size (5 characters)
    if (email.length < 5) {
      return "Email must be at least 5 characters long";
    }

    // Check maximum size (254 characters)
    if (email.length > 254) {
      return "Email must not exceed 254 characters";
    }

    // Check for spaces
    if (/\s/.test(email)) {
      return "Email must not contain spaces";
    }

    // Check for prohibited characters (< > { } ; ,)
    if (/[<>{}';,]/.test(email)) {
      return "Email contains prohibited characters (< > { } ; ,)";
    }

    // Check if contains @
    if (!email.includes('@')) {
      return "Email must contain @";
    }

    // Split by @ to validate parts
    const parts = email.split('@');
    
    // Check if there's more than one @
    if (parts.length !== 2) {
      return "Email must contain exactly one @";
    }

    const [localPart, domainPart] = parts;

    // Check if has at least 1 character before @
    if (localPart.length < 1) {
      return "Email must have at least 1 character before @";
    }

    // Check if contains a period (.) after the @
    if (!domainPart.includes('.')) {
      return "Email must contain a period (.) after @";
    }

    // Check if has at least 2 characters after the last period
    const lastDotIndex = domainPart.lastIndexOf('.');
    const afterLastDot = domainPart.substring(lastDotIndex + 1);
    
    if (afterLastDot.length < 2) {
      return "Email must have at least 2 characters after the last period";
    }

    // Check if domain part is valid (not starting or ending with dot)
    if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
      return "Invalid email format";
    }

    return ""; // Valid email
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate email in real-time
    if (name === "email") {
      const error = validateEmail(value);
      setEmailError(error);
    }
  };

  const handleLogin = async () => {
    // Validate email before sending
    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setAlertMessage([emailValidationError]);
      return;
    }

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
    // Validate email before sending
    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setAlertMessage([emailValidationError]);
      return;
    }

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
          <div className="input-wrapper">
            <input 
              data-qa-locator="input-email" 
              type="email" 
              placeholder="Email address" 
              name="email" 
              value={formData.email} 
              onChange={changeHandler}
              className={emailError ? "input-error" : ""}
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>
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
