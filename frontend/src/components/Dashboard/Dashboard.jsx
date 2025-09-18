import React from "react";
import NavBar from "../NavBar/NavBar";
import HeroSection from "../HeroSection/Hero";
import FeaturesSection from "../Features/Features";
// import VoiceAgentCard from "../VoiceAgentCard/VoiceAgentCard";

export default function Dashboard({ username, onLogout }) {
  return (
    <div className="main-app-container">
      <div className="background-pattern"></div>

      <NavBar />

      <main className="main-content">
        <HeroSection username={username} />
        <FeaturesSection />
      </main>
    </div>
  );
}
