import React, { useState, useEffect, useRef } from "react";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const containerRef = useRef(null);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  const toggleDarkMode = () => {
    setDarkMode((d) => !d);
  };

  // Apply dark-mode to body class
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleDocumentClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  return (
    <header className="header">
      <div className="left">
        <button className="hamburger" aria-label="menu">☰</button>
        <h2 className="brand-name">Digital Company</h2>
      </div>

      <div className="right">
        <button className="invite-btn">👤 Invite Team Member</button>

        <div className="profile-container" ref={containerRef}>
          <div
            className="profile"
            onClick={toggleMenu}
            role="button"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            FL
          </div>

          {menuOpen && (
            <div className="profile-menu" role="menu">
              <ul>
                <li>
                  <div className="dark-mode-toggle">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={toggleDarkMode}
                      />
                      <span className="slider" />
                    </label>
                    <span className="dm-label">Dark</span>
                  </div>
                </li>
                <li>Profile</li>
                <li>What’s New</li>
                <li>Help</li>
                <li>Send Feedback</li>
                <li>Hints & Shortcuts</li>
                <li>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
