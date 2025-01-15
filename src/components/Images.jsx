import React, { useEffect } from "react";
import "../components/Images.css";
import { Link } from "react-router-dom";

const Image = ({ src, title, name, guid, animation }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of animations
      once: false, // Change to false to allow animations on every scroll
    });
    
    // Refresh AOS when the component mounts or updates
    AOS.refresh();
    
    // Optional: Listen to scroll events to refresh AOS
    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener("scroll", handleScroll);
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="image-container-new-component" data-aos={animation}>
      <img className="img-new-component" src={src} alt={name} />
      <div className="overlay-new-component">
        {/* <h3 style={{fontSize:"26px" , fontFamily:"Recoleta-Regular" , letterSpacing:"1.5px"}}>{title}</h3> */}
        <p><Link to={`/details?guid=${guid}`}>More Details</Link></p>
      </div>
    </div>
  );
};

export default Image;

