import React, { useState, useEffect } from "react";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode to body class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <header className="header">
      <div className="left">
        <button className="hamburger">☰</button>
        <h2>Digital Company</h2>
      </div>

      <div className="right">
        <button>👤 Invite Team Member</button>

        <div
          className="profile-container"
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={closeMenu}
        >
          <div className="profile" onClick={toggleMenu}>
            FL
          </div>

          {menuOpen && (
            <div className="profile-menu">
              <ul>
                <li>
                  <div className="dark-mode-toggle">
                    <span></span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={toggleDarkMode}
                      />
                      <span className="slider"></span>
                    </label>
                    <span> Dark</span>
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
