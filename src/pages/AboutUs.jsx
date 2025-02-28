import { Link } from "react-router-dom";
import "../pages/AboutUs.css";
import Footer from "../components/Footer";
import TestimonialSlider from "../components/Testimonials";
import Flower from "../components/Flower";
import Flowerright from "../components/Flowerright";
import { useLanguage } from "../LanguageContext";

const About = () => {
  const { language } = useLanguage(); // Access language context

  return (
    <div className="about-page">
      {/* <div className="about-us">
        <div>
          <h1 style={{fontFamily:"Recoleta-Regular"}}>{language === 'en' ? 'About Us' : 'Om Os'}</h1>
          <p style={{fontFamily:"Recoleta-Regular"}}>{language === 'en' ? 'Home' : 'Hjem'} / <span style={{color:'red'}}>{language === 'en' ? 'About Us' : 'Om Os'}</span></p>
        </div>
        
      </div> */}
      {/* <Flowerright /> */}
      {/* <section style={{ marginTop: "12vw" }}>
        <Flowerright />
        <div className="aboutus-hero-section">
          <div className="inner-about-sec">
            <h1 style={{ fontFamily: "Recoleta-Regular" }}>
              {language === "en"
                ? "About Us for Massage "
                : "Om os til massage"}{" "}
              <br className="hidden lg:block" />{" "}
              {language === "en" ? "and Escort Services" : "og Escort Services"}
            </h1>

            <p>
              {language === "en"
                ? "Welcome to [Escort Nights], your destination for relaxation and "
                : "Velkommen til [Escort Nights], din destination for afslapning og"}
              <br className="hidden lg:block" />
              {language === "en"
                ? "companionship. We offer a range of soothing massage therapies and"
                : "kammeratskab. Vi tilbyder en række beroligende massagebehandlinger og"}{" "}
              <br className="hidden lg:block" />
              {language === "en"
                ? "professional escort services, designed to provide comfort, relaxation, and"
                : "professionelle escorttjenester, designet til at give komfort, afslapning og"}{" "}
              <br className="hidden lg:block" />
              {language === "en"
                ? "an unforgettable experience. Our team is dedicated to ensuring your "
                : "en uforglemmelig oplevelse. Vores team er dedikeret til at sikre din"}
              <br className="hidden lg:block" />
              {language === "en"
                ? "privacy, satisfaction, and comfort at all times. Discover a new level of "
                : "privatliv, tilfredshed og komfort til enhver tid. Oplev et nyt niveau af"}{" "}
              <br className="hidden lg:block" />
              {language === "en" ? "care with us." : "pleje med os."}
            </p>
            
          </div>
        </div>
      </section> */}

      <Flower />

      <section
        className="quote"
        style={{
          backgroundColor: "black",
          marginTop: "100px",
          marginBottom: "8vw",
        }}
      >
        <div className="quote-text">
          <h1 style={{ fontFamily: "Recoleta-Regular" }}>
            {language === "en" ? "Our Story" : "Vores historie"}{" "}
          </h1>
          <img className="para-img" src="./assests/right.png" alt="" />
          <p>
            {language === "en"
              ? "Welcome to Your Escort Nights, where elegance, sophistication, and discretion come together to offer an unparalleled escort experience. Founded with the vision of providing high-class companionship services, our journey began with a simple goal: to connect discerning individuals with exceptional escorts who value privacy, respect, and unforgettable moments."
              : "Velkommen til dit webstedsnavn, hvor elegance, sofistikering og diskretion mødes for at tilbyde en escortoplevelse uden sidestykke. Grundlagt med visionen om at levere kammeratskabstjenester af høj klasse, begyndte vores rejse med et enkelt mål: at forbinde kræsne individer med exceptionelle ledsagere, der værdsætter privatliv, respekt og uforglemmelige øjeblikke."}
          </p>
          <p>
            {language === "en"
              ? "Since our inception, we have grown to become a trusted name in the industry, recognized for our commitment to excellence and professionalism. Our carefully selected companions are not just beautiful but also intelligent, charming, and engaging individuals who understand the importance of creating meaningful connections."
              : "Siden vores start er vi vokset til at blive et betroet navn i branchen, anerkendt for vores forpligtelse til ekspertise og professionalisme. Vores omhyggeligt udvalgte ledsagere er ikke bare smukke, men også intelligente, charmerende og engagerende individer, der forstår vigtigheden af ​​at skabe meningsfulde forbindelser."}
          </p>

          <p>
            {language === "en"
              ? "At Your Escort Nights, we believe in offering more than just a service; we provide experiences. Whether its accompanying you to an upscale event, traveling to an exotic destination, or sharing a quiet, intimate evening, our escorts are here to make every moment special."
              : "Hos dit webstedsnavn tror vi på at tilbyde mere end blot en service; vi giver oplevelser. Uanset om det ledsager dig til en eksklusiv begivenhed, rejser til en eksotisk destination eller deler en stille, intim aften, er vores eskorte her for at gøre hvert øjeblik specielt."}{" "}
          </p>
        </div>
      </section>

      <Flower />
      <section>
        {/* <h1
          style={{ fontFamily: "Recoleta-Regular" }}
          className="text-center text-2xl mt-10 text-white"
        >
          {language === "en" ? "Testimonials" : "Udtalelser"}
        </h1>
        <h1
          style={{ fontFamily: "Recoleta-Regular" }}
          className="text-center text-4xl text-white mb-5"
        >
          {language === "en"
            ? "What Our Clients Say"
            : "Hvad vores kunder siger"}
        </h1>
        <TestimonialSlider />
        <Flowerright />
        <br />
        <br />
        <br />
        <br /> */}

        <Footer />
      </section>
    </div>
  );
};

export default About;
