import React, { useState } from "react";
import "./LoginForm.css";

const LoginForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Username is required");
      return;
    }
    if (name.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }
    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onSubmit(name.trim());
    }, 1000);
  };

  return (
    <div className="login-form">
      <div className="form-header">
        <div className="logo-container">
          <div className="logo-icon">🎤</div>
          <h1>JARVIS EYE</h1>
        </div>
        <p className="form-subtitle">Enter the future of AI voice automation</p>
      </div>

      <div className="form-content">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your username"
            className={error ? "input-error" : ""}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button
          onClick={handleSubmit}
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Verifying...
            </>
          ) : (
            <>
              Continue to Verification
              <span className="btn-arrow">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
