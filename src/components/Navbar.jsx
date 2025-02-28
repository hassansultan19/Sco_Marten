import { Link, useLocation } from "react-router-dom";
import "../components/Navbar.css";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../LanguageContext";
import usa from "../assests/britishflag.svg";
import denmark from "../assests/denmark.svg";

function Navbar() {
  const { language, setLanguage } = useLanguage(); // Access language context
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State for toggling the navbar menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for toggling the language dropdown
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // State for user dropdown
  const dropdownRef = useRef(null); // Ref to the dropdown element
  const userDropdownRef = useRef(null); // Ref to the user dropdown element

  const userName = sessionStorage.getItem("name");
  console.log("name", userName);

  const userToken = sessionStorage.getItem("authToken");
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    if (isOpen) setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  // Language change handler
  const handleLanguageChange = (lang) => {
    setLanguage(lang); // Update the language context
    setIsDropdownOpen(false);
  };
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Logout function to clear session data
  const handleLogout = () => {
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("authToken");
    setIsUserDropdownOpen(false);
    history.push("/login"); // Redirect to login or home after logout
  };

  // Effect for detecting clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdownRef
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener for clicks
    document.addEventListener("click", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="container mx-auto">
        <div className="navbar">
          <div className="text-1">
            <Link
              style={{ color: "white" }}
              className="link logoLink"
              to="/"
              onClick={closeMenu}
            >
              <img
                style={{ width: "140px", objectFit: "contain" }}
                src="../assests/logo.png"
                alt=""
              />
            </Link>
          </div>
          <div className={`text-2flags ${isOpen ? "open" : ""}`}>
            {/* <div className="language-dropdown" ref={dropdownRef}> */}
            <div className="language-dropdown">
              {/* Display the currently active flag */}
              {/* <img
                src={language === "da" ? denmark : usa} // Dynamically display the active flag
                alt="Language"
                onClick={toggleDropdown}
                style={{ width: "20px", cursor: "pointer" }}
              /> */}

              {/* Dropdown menu */}
              <div className="dropdown-menu">
                {/* Show only the inactive language */}
                <div
                  className="dropdown-item"
                  onClick={() => handleLanguageChange("en")}
                >
                  <img
                    src={usa}
                    alt="English"
                    style={{ width: "20px", cursor: "pointer" }}
                  />{" "}
                  {/* English */}
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => handleLanguageChange("da")}
                >
                  <img
                    src={denmark}
                    alt="Danish"
                    style={{ width: "20px", cursor: "pointer" }}
                  />{" "}
                  {/* Danish */}
                </div>
              </div>
            </div>
          </div>
          <div className={`text-2 ${isOpen ? "open" : ""}`}>
            <Link
              style={{ color: "white" }}
              className="link"
              to="/"
              onClick={closeMenu}
            >
              {language === "en" ? "Home" : "Hjem"}
            </Link>
            <Link
              style={{ color: "white" }}
              className="link"
              to="/about"
              onClick={closeMenu}
            >
              {language === "en" ? "About Us" : "Om Os"}
            </Link>
            <Link
              style={{ color: "white" }}
              className="link"
              to="/Adverts"
              onClick={closeMenu}
            >
              {language === "en" ? "Adverts" : "Annoncer"}
            </Link>

            {userToken && userName ? (
              <div
                className="user-dropdown"
                ref={userDropdownRef}
                onMouseEnter={toggleUserDropdown}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <span style={{ color: "white", cursor: "pointer" }}>
                  {userName} ▼
                </span>
                {isUserDropdownOpen && (
                  <div className="user-dropdown-menu">
                    <button className="logout-btn" onClick={handleLogout}>
                      {language === "en" ? "Logout" : "Log ud"}
                    </button>
                    <Link to="/dashboard">
                      {language === "en" ? "Profile" : "Profil"}
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  style={{ color: "white" }}
                  className="link"
                  to="/login"
                  onClick={closeMenu}
                >
                  {language === "en" ? "Sign in" : "Log ind"}
                </Link>
                <Link
                  style={{ color: "white" }}
                  className="link"
                  to="/registrationForm"
                  onClick={closeMenu}
                >
                  {language === "en" ? "Registration" : "Registration"}
                </Link>
              </>
            )}

            {/* Language Dropdown */}

            {/* <Link
              to="/bookAnAppointment"
              onClick={closeMenu}
              className="link"
            >
              <button
                className="all-btn-hover"
                style={{
                  padding: '10px 15px',
                  backgroundColor: 'red',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  background: "#990000"
                }}
              >
                Book an appointment
              </button>
            </Link> */}
          </div>
          <button className="menu-toggle text-white" onClick={toggleMenu}>
            {isOpen ? "Close" : <i className="fa-solid fa-bars"></i>}
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
