import React, { useState, useEffect } from "react";
import "./NavBar.css";

const NavBar = ({ user, isAuthenticated, onLogout }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "home";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id");
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-profile-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo-container">
          <div className="logo-icon">🤖</div>
          <div className="logo-text">JARVIS EYE</div>
        </div>

        <div className="nav-links">
          <a
            href="#home"
            className={`nav-link ${activeSection === "home" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
          >
            Home
          </a>
          <a
            href="#voice-agents"
            className={`nav-link ${
              activeSection === "voice-agents" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("voice-agents");
            }}
          >
            Voice Agent
          </a>
          <a
            href="#services"
            className={`nav-link ${
              activeSection === "services" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("services");
            }}
          >
            Services
          </a>
          <a
            href="#tasks"
            className={`nav-link ${activeSection === "tasks" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("tasks");
            }}
          >
            Tasks
          </a>
        </div>

        <div className="nav-actions">
          {isAuthenticated && user ? (
            <div className="user-profile-container">
              <div className="user-profile" onClick={handleUserMenuToggle}>
                <div className="user-avatar">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  {user.age && (
                    <span className="user-age">Age: {user.age}</span>
                  )}
                </div>
                <div className="dropdown-arrow">▼</div>
              </div>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="dropdown-info">
                      <div className="dropdown-name">{user.name}</div>
                      {user.age && (
                        <div className="dropdown-age">Age: {user.age}</div>
                      )}
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item profile-btn">
                    👤 View Profile
                  </button>
                  <button className="dropdown-item settings-btn">
                    ⚙️ Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
