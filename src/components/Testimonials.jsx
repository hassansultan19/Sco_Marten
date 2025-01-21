import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "../components/TestimonialSlider.css"; // CSS included

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState([]);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          "http://192.168.18.83:8000/api/admin/testimonial"
        );
        const data = await response.json();
        if (data.status && data.data.testimonials) {
          // Filter testimonials by status (e.g., show only approved ones)
          const approvedTestimonials = data.data.testimonials.filter(
            (testimonial) => testimonial.status === 1
          );
          setTestimonials(approvedTestimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // Show arrows for navigation
    autoplay: false,
  };

  return (
    <>
      <div className="testimonial-slider">
        {testimonials.length > 0 ? (
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial">
                {/* Image placeholder (if no image URL is provided in the API) */}
                <img
                  src={
                    testimonial.media[0].original_url || "../assests/tes.png"
                  } // Replace with your default image path if needed
                  alt={testimonial.name}
                  className="testimonial-image"
                />
                <p>{testimonial.message}</p>
                <div className="testimonial-rating">
                  {"★".repeat(testimonial.rating)}
                  {"☆".repeat(5 - testimonial.rating)}
                </div>
                <h4 style={{ fontWeight: "700" }}>{testimonial.name}</h4>
              </div>
            ))}
          </Slider>
        ) : (
          <p>Loading testimonials...</p>
        )}
      </div>
    </>
  );
};

export default TestimonialSlider;
