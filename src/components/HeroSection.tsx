import React from "react";
import "./HeroSection.css";

const HeroSection: React.FC = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">BankingApp</h1>
        <p className="hero-subtitle">Modular Clean Architecture Starter</p>
        <div className="hero-description">
          <p>
            Base project Android modern untuk membangun aplikasi perbankan
            dengan arsitektur modular, Jetpack Compose, MVVM + Clean
            Architecture, dan Hilt
          </p>
        </div>
        <div className="hero-meta">
          <div className="meta-item">
            <span className="meta-label">Dokumentasi Teknis</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Version 1.0 - 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

