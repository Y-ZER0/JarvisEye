import React, { useState } from "react";
import LoginForm from "./components/LoginForm/LoginForm";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import AccessResult from "./components/AccessResult/AccessResult";
import Dashboard from "./components/Dashboard/Dashboard";
import "./App.css";

const App = () => {
  const [currentStep, setCurrentStep] = useState("login");
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authResult, setAuthResult] = useState(null);

  const handleLoginSubmit = (name) => {
    setUsername(name.trim());
    setCurrentStep("imageUpload");
  };

  const handleImageUpload = (result) => {
    console.log("Authentication result:", result);
    // Store the complete authentication result from backend
    setAuthResult(result);
    setCurrentStep("accessResult");
  };

  const handleAccessResult = () => {
    // Only set authenticated if the face recognition passed
    if (authResult && authResult.isAuthenticated) {
      setIsAuthenticated(true);
      setCurrentStep("dashboard");
    } else {
      // If access was denied, user can retry from the access result page
      console.log("Access denied, staying on result page");
    }
  };

  const handleRetry = () => {
    setCurrentStep("imageUpload");
    setAuthResult(null);
  };

  const handleBack = () => {
    setCurrentStep("login");
    setUsername("");
    setAuthResult(null);
    setIsAuthenticated(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentStep("login");
    setUsername("");
    setAuthResult(null);
  };

  // If authenticated, show dashboard
  if (isAuthenticated && currentStep === "dashboard") {
    return <Dashboard username={username} onLogout={handleLogout} />;
  }

  return (
    <div className="app-container">
      <div className="background-pattern"></div>
      <div className="content-wrapper">
        {currentStep === "login" && <LoginForm onSubmit={handleLoginSubmit} />}

        {currentStep === "imageUpload" && (
          <ImageUpload
            username={username}
            onUpload={handleImageUpload}
            onBack={handleBack}
          />
        )}

        {currentStep === "accessResult" && authResult && (
          <AccessResult
            granted={authResult.isAuthenticated}
            username={username}
            onRetry={handleRetry}
            onContinue={handleAccessResult}
            authResult={authResult}
          />
        )}
      </div>

      {/* Development info panel - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: 1000,
          }}
        >
          <div>Step: {currentStep}</div>
          <div>Username: {username}</div>
          <div>Authenticated: {isAuthenticated ? "Yes" : "No"}</div>
          {authResult && (
            <>
              <div>Predicted: {authResult.predictedName}</div>
              <div>Confidence: {authResult.confidence}</div>
            </>
          )}
        </div>
      )}

      <style>{`
        /* Section Placeholders */
        .section-placeholder {
          padding: 6rem 2rem;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .placeholder-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #6c63ff, #ff6b9d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .placeholder-content p {
          color: #b8b9da;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .hero {
            padding: 6rem 1rem 2rem;
          }

          .features {
            padding: 4rem 1rem;
          }

          .features-title {
            font-size: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .feature-card {
            padding: 2rem;
          }

          .nav-links {
            display: none;
          }

          .nav-container {
            padding: 0 1rem;
          }

          .voice-agent-demo {
            margin: 0 1rem;
            padding: 2rem;
          }

          .control-btn {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }

          .login-form,
          .image-upload,
          .access-result {
            margin: 0 1rem;
            padding: 2rem;
          }a
        }
      `}</style>
    </div>
  );
};

export default App;
