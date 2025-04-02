// src/components/Footer.js
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext"; // Import the useLanguage hook
import "./Footer.css";

const Footer = () => {
  const { language } = useLanguage();

  return (
    <div>
      <footer className="footer-container">
        {/* <div
          className="newsletter flex justify-between"
          style={{ alignItems: "center" }}
        >
          <p className="text-start">
            {language === "en" ? "Newsletter" : "Nyhedsbrev"} <br />
            {language === "en"
              ? "Be the first one to know about discounts, offers and events"
              : "Vær den første til at vide om rabatter, tilbud og begivenheder"}
          </p>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder={
                language === "en" ? "Enter your email" : " din e-mail"
              }
              style={{
                color: "black",
                padding: "10px",
                backgroundColor: "white",
              }}
            />
            <button
              type="submit"
              style={{ color: "white", backgroundColor: "#990000" }}
            >
              {language === "en" ? "Submit" : "Opret"}
            </button>
          </form>
        </div> */}

        <div className="footer-content">
          {/* Company Information */}
          <div className="footer-section company-info">
            <img
              src="./assests/logo.png"
              alt=""
              style={{ width: "120px", height: "60px", objectFit: "contain" }}
            />

            <div className="subscribe-now">
              {/* <p style={{ fontWeight: "600", fontSize: "22px" }}>{language === 'en' ? 'Subscribe Now' : 'Tilmeld dig nu'}</p> */}
              {/* <form style={{ display: "flex", alignItems: "center" }}>
                <i className="fa-solid fa-envelope"></i>
                <input className='footer-input-inner' type="email" placeholder={language === 'en' ? "Enter Your Email" : " din e-mail"} />
              </form> */}
            </div>
          </div>

          {/* Information Links */}
          <div className="footer-section">
            <h4 style={{ fontWeight: "600" }}>
              {language === "en" ? "Information" : "Information"}
            </h4>
            <ul style={{ cursor: "pointer" }}>
              <li>
                <Link to="/">{language === "en" ? "Home" : "Hjem"}</Link>
              </li>
              <li>
                <Link to="/about">
                  {language === "en" ? "About Us" : "Om Os"}
                </Link>
              </li>
              <li>
                <Link to="/Adverts">
                  {language === "en" ? "Adverts" : "Annoncer"}
                </Link>
              </li>
              <li>
                <Link to="/registrationForm">
                  {language === "en" ? "Registration" : "Tilmelding"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-section contact-info ">
            <h4 className="pader" style={{ fontWeight: "600" }}>
              {language === "en" ? "Contact Us" : "Kontakt Os"}
            </h4>
            <ul>
              {/* <li><i className="fa fa-phone"></i> (307) 555-0133</li> */}
              <li
                style={{
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <i style={{ fontSize: "19px" }} className="fa fa-envelope"></i>{" "}
                support@escortnights.dk
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            {language === "en"
              ? "2025 Massage. All rights reserved by Escort"
              : "2025 Massage. Alle rettigheder forbeholdes af Escort"}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
