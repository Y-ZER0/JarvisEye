import React from "react";
import VoiceAgentCard from "../VoiceAgentCard/VoiceAgentCard";
import "./Hero.css";

const HeroSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Jarvis Eye: Intelligent Identity & Voice Automation
        </h1>
        <p className="hero-subtitle">
          Secure your interactions with face recognition. Command your
          environment with your voice. Experience seamless automation backed by
          state-of-the-art AI agents built to listen, see, and act.{" "}
        </p>

        <div className="hero-actions">
          <button
            className="btn-secondary"
            onClick={() => scrollToSection("services")}
          >
            Explore AI Services
          </button>
        </div>

        <VoiceAgentCard />
      </div>
    </section>
  );
};

export default HeroSection;
