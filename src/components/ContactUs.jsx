import { useLanguage } from "../LanguageContext";
import "./ContactUs.css";
import Flower from "./Flower";

const ContactUs = () => {
  const { language } = useLanguage(); // Access language context
  return (
    <div className="contact-us-container">
      {/* <h1 style={{ fontFamily: "Recoleta-Regular" }}>Contact Us</h1> */}
      <div className="contact-content">
        {/* Left-side image */}
        <div className="contact-image">
          <img width={400} src="../assests/logo.png" alt="Contact" />
        </div>
        <Flower />

        {/* Right-side form */}
        <div className="contact-form">
          <h2 style={{ fontFamily: "Recoleta-Regular" }}>
            {language === "en" ? "Get In Touch" : "Tag kontakt"}
          </h2>
          <form>
            <div className="form-row">
              <div className="input-container">
                <input type="text" required />
                <label>{language === "en" ? "Name" : "Navn"}</label>
              </div>
              <div className="input-container">
                <input type="email" required />
                <label>{language === "en" ? "Email" : "E-mail"}</label>
              </div>
            </div>
            <div className="form-row">
              <div className="input-container">
                <input type="text" />
                <label>
                  {language === "en" ? "Select Services" : "Vælg Tjenester"}
                </label>
              </div>
              {/* <div className="input-container">
                <input type="tel" />
                <label>{language === "en" ? "Number" : "Antal"}</label>
              </div> */}
            </div>
            <div className="form-row">
              <div className="input-container">
                <textarea rows="6"></textarea>
                <label>{language === "en" ? "Message" : "Besked"}</label>
              </div>
            </div>
            <button
              style={{ backgroundColor: "#990000", width: "200px" }}
              type="submit"
              className="submit-btn"
            >
              {language === "en" ? "Send Message" : "Send besked"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
