import { Link, useLocation, useNavigate } from "react-router-dom";
import "../components/Navbar.css";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../LanguageContext";
import usa from "../assests/britishflag.svg";
import denmark from "../assests/denmark.svg";
import { useUser } from "../store/useUser";

function Navbar() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const userName = localStorage.getItem("name");
  console.log("name", userName);

  const userToken = localStorage.getItem("authToken");
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    if (isOpen) setIsOpen(false);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsDropdownOpen(false);
  };
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };
  const navigation = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    setIsUserDropdownOpen(false);
    navigation("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const { setPackage } = useUser();

  const fetchPackages = async (userId) => {
    try {
      const response = await fetch(
        `http://192.168.18.74:800/api/escort/get-user-package/${userId}`
      );
      const data = await response.json();
      if (data.data?.escorts) {
        setPackage(data.data.escorts);
      } else {
        setPackage({});
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchPackages(userId);
    } else {
      navigation("/");
    }
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
            <div className="language-dropdown">
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => handleLanguageChange("en")}
                >
                  <img
                    src={usa}
                    alt="English"
                    style={{ width: "20px", cursor: "pointer" }}
                  />{" "}
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
            {userToken && userName && (
              <Link
                style={{ color: "white" }}
                className="link"
                to="/packages"
                onClick={closeMenu}
              >
                {language === "en" ? "Packages" : "Om Os"}
              </Link>
            )}
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
