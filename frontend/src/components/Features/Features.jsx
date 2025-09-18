import React from "react";
import "./Features.css";

const Features = () => {
  const features = [
    {
      icon: "👤",
      title: "Face Recognition System",
      description:
        "Advanced facial recognition technology with real-time authentication and user verification. Secure, fast, and accurate identification.",
    },
    {
      icon: "🎙️",
      title: "AI Voice Agent",
      description:
        "Intelligent voice agents powered by cutting-edge AI technology. Natural conversations, voice commands, and automated assistance.",
    },
  ];

  return (
    <section id="services" className="features">
      <h2 className="features-title">🚀 AI Services</h2>
      <p className="features-subtitle">
        Advanced AI-powered solutions for face recognition and voice interaction
      </p>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
