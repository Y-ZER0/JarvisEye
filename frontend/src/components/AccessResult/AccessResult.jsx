import React from "react";
import "./AccessResult.css";

const AccessResult = ({
  granted,
  username,
  onRetry,
  onContinue,
  authResult,
}) => {
  const getFailureReason = () => {
    if (!authResult || !authResult.details) return "Unknown error occurred";

    const { details } = authResult;

    if (!details.confidence_met) {
      return `Low confidence in face recognition: ${(
        authResult.confidence * 100
      ).toFixed(1)}%`;
    }

    if (!details.names_match) {
      return `Identity mismatch: Recognized as "${authResult.predictedName}", but you entered "${username}"`;
    }

    if (!details.user_approved) {
      return `Access denied: Your account status is "${authResult.userStatus}"`;
    }

    return authResult.message || "Verification failed";
  };

  const getVerificationSteps = () => {
    if (!authResult || !authResult.details) return [];

    const { details } = authResult;

    return [
      {
        step: "Face Recognition",
        passed: details.confidence_met,
        details: `Confidence: ${(authResult.confidence * 100).toFixed(1)}%`,
        icon: details.confidence_met ? "✅" : "❌",
      },
      {
        step: "Name Matching",
        passed: details.names_match,
        details: details.names_match
          ? `Matched: ${authResult.predictedName}`
          : `Expected: ${username}, Got: ${authResult.predictedName}`,
        icon: details.names_match ? "✅" : "❌",
      },
      {
        step: "Account Status",
        passed: details.user_approved,
        details: `Status: ${authResult.userStatus}`,
        icon: details.user_approved ? "✅" : "❌",
      },
    ];
  };

  return (
    <div className={`access-result ${granted ? "granted" : "denied"}`}>
      <div className="result-icon">{granted ? "🎉" : "⛔"}</div>

      <h2>{granted ? "Access Granted!" : "Access Denied"}</h2>

      {granted ? (
        <div className="success-content">
          <p>
            Welcome to VocalIQ,{" "}
            <span className="username-highlight">{username}</span>!
          </p>
          <p className="success-subtitle">
            Your identity has been verified successfully. You now have access to
            all AI voice automation features.
          </p>

          {/* Show verification details */}
          <div className="verification-summary">
            <h3>✅ Verification Summary</h3>
            <div className="verification-steps">
              {getVerificationSteps().map((step, index) => (
                <div
                  key={index}
                  className={`verification-step ${
                    step.passed ? "passed" : "failed"
                  }`}
                >
                  <span className="step-icon">{step.icon}</span>
                  <div className="step-info">
                    <strong>{step.step}</strong>
                    <span className="step-details">{step.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="feature-preview">
            <p>🚀 You now have access to:</p>
            <ul>
              <li>• Advanced AI Voice Agents</li>
              <li>• Workflow Automation Tools</li>
              <li>• Smart Campaign Management</li>
              <li>• Real-time Analytics Dashboard</li>
              <li>• Custom Voice Training</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="denied-content">
          <p className="denial-message">{getFailureReason()}</p>

          {/* Show what went wrong */}
          <div className="verification-breakdown">
            <h3>🔍 Verification Breakdown</h3>
            <div className="verification-steps">
              {getVerificationSteps().map((step, index) => (
                <div
                  key={index}
                  className={`verification-step ${
                    step.passed ? "passed" : "failed"
                  }`}
                >
                  <span className="step-icon">{step.icon}</span>
                  <div className="step-info">
                    <strong>{step.step}</strong>
                    <span className="step-details">{step.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {authResult?.userStatus === "denied" ? (
            <div className="account-status-warning">
              <h3>⚠️ Account Status Issue</h3>
              <p>
                Your account is marked as <strong>denied</strong> in our system.
                Please contact support for assistance.
              </p>
            </div>
          ) : (
            <div className="retry-tips">
              <h3>💡 Tips for better results:</h3>
              <ul>
                <li>• Ensure your face is clearly visible and well-lit</li>
                <li>• Face the camera directly</li>
                <li>• Remove sunglasses, masks, or obstructions</li>
                <li>• Use a recent, high-quality photo</li>
                <li>• Make sure you entered the correct username</li>
                <li>• Ensure your face is not blurry or pixelated</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="action-buttons">
        <button
          className="btn-primary"
          onClick={granted ? onContinue : onRetry}
        >
          {granted ? (
            <>
              Enter Dashboard
              <span className="btn-arrow">→</span>
            </>
          ) : authResult?.userStatus === "denied" ? (
            "Contact Support"
          ) : (
            "Try Again"
          )}
        </button>

        {!granted && (
          <button
            className="btn-outline"
            onClick={() => window.location.reload()}
            style={{ marginTop: "1rem" }}
          >
            Start Over
          </button>
        )}
      </div>
    </div>
  );
};

export default AccessResult;
