import React, { useState } from "react";
import "./ImageUpload.css";

const ImageUpload = ({ username, onUpload, onBack }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    processFile(f);
  };

  const processFile = (f) => {
    if (!f) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(f.type)) {
      setError("Please upload a valid image file (JPG, PNG, or GIF)");
      return;
    }

    // Check file size (5MB limit)
    if (f.size > 5 * 1024 * 1024) {
      setError("Image file size must be less than 5MB");
      return;
    }

    setError("");
    setFile(f);

    // Create preview URL
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    processFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image for face verification");
      return;
    }

    if (!username?.trim()) {
      setError("Username is missing. Please go back and enter your username.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Create FormData to send file and username
      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", username.toLowerCase().trim());

      console.log("Sending verification request...");
      console.log("Username:", username);

      // Send request to Flask backend
      const response = await fetch("http://localhost:5000/verify_face", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // Pass the complete authentication result to parent component
      onUpload({
        isAuthenticated: data.is_authenticated,
        predictedName: data.predicted_name,
        confidence: data.confidence,
        username: data.provided_username,
        userStatus: data.user_status,
        namesMatch: data.names_match,
        isApproved: data.is_approved,
        message: data.message,
        details: data.details,
      });
    } catch (error) {
      console.error("Face verification error:", error);
      setError(`Verification failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Clean up preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="image-upload">
      <div className="form-header">
        <h2>Face Recognition Verification</h2>
        <p className="form-subtitle">
          Welcome back, <span className="username-highlight">{username}</span>
        </p>
        <p className="verification-text">
          Please upload a clear photo of your face for identity verification and
          access approval
        </p>
        <div className="verification-steps">
          <div className="step">
            <span className="step-number">1</span>
            <span className="step-text">Face Recognition</span>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <span className="step-text">Name Matching</span>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <span className="step-text">Approval Status</span>
          </div>
        </div>
      </div>

      <div className="form-content">
        <div
          className={`upload-zone ${dragOver ? "drag-over" : ""} ${
            previewUrl ? "has-image" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="image-preview">
              <img
                src={previewUrl}
                alt="Face preview"
                className="preview-img"
              />
              <div className="image-overlay">
                <button
                  type="button"
                  className="change-image-btn"
                  onClick={() => document.getElementById("file-input").click()}
                  disabled={uploading}
                >
                  Change Image
                </button>
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">📷</div>
              <p>Drag & drop your photo here</p>
              <p className="upload-or">or</p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => document.getElementById("file-input").click()}
                disabled={uploading}
              >
                Choose File
              </button>
              <div className="upload-tips">
                <p>📝 Tips for best results:</p>
                <ul>
                  <li>• Face the camera directly</li>
                  <li>• Ensure good lighting</li>
                  <li>• Remove sunglasses/masks</li>
                  <li>• Use a clear, recent photo</li>
                </ul>
              </div>
            </div>
          )}
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="btn-outline"
            onClick={onBack}
            disabled={uploading}
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={uploading || !file}
          >
            {uploading ? (
              <>
                <span className="loading-spinner"></span>
                Verifying Identity...
              </>
            ) : (
              "Complete Verification"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
