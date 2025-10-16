import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import DocumentationOverview from "./documentation/DocumentationOverview";
import "./DocumentationApp.css";

const DocumentationApp: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { logout } = useAuth();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch("/README.md");
      if (!response.ok) {
        throw new Error("Failed to fetch README.md");
      }
      const text = await response.text();

      // Create a blob from the text
      const blob = new Blob([text], { type: "text/markdown" });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = "ebank-documentation.md";

      // Append to the document and trigger a click
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo">E</div>
            <h1>EBank Documentation</h1>
          </div>
          <div className="header-actions">
            <a
              href="https://github.com/mutiarahns/ebanking"
              target="_blank"
              rel="noopener noreferrer"
              className="header-button github-button"
            >
              GitHub
            </a>
            <button
              className={`header-button primary ${
                isDownloading ? "downloading" : ""
              }`}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? "Downloading..." : "Download"}
            </button>
            <button
              className="header-button logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <DocumentationOverview />
      </main>
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} EBank. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocumentationApp;
