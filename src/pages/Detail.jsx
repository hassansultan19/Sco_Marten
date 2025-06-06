import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ContactUs from "../components/ContactUs";
import Flower from "../components/Flower";
import Flowerright from "../components/Flowerright";
import Footer from "../components/Footer";
import "../pages/Details.css";
import Slider from "react-slick";
import "../components/TestimonialSlider.css"; // CSS included

import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaWhatsapp,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
import NewRightImagesFlover from "../components/NewRightImagesFlover";
import NewLeftImagesFlover from "../components/NewLeftImagesFlover";
import Swal from "sweetalert2";
import { useLanguage } from "../LanguageContext";

const Detail = () => {
  const [modelDetail, setModelDetail] = useState(null);
  const [modelDetailId, setModelDetailId] = useState(null);
  const [cardRelatedData, setCardRelatedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    rating: 0,
  });

  const params = new URLSearchParams(location.search);
  const guid = params.get("guid");
  const fetchData = async () => {
    if (guid) {
      try {
        const response = await axios.get(
          `
https://escortnights.dk/backend-martin/public/api/escort/getById/${guid}`
        );
        console.log("response", response.data.data.escort);
        setModelDetail(response.data.data.escort);
        setModelDetailId(response.data.data.escort.id);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const response = await fetch(
        `
https://escortnights.dk/backend-martin/public/api/escort/getRelated/${guid}`
      );
      const jsonData = await response.json();
      console.log(jsonData); // Log the full response for debugging

      // Check if the response is successful
      if (jsonData.status) {
        setCardRelatedData(jsonData.data.escorts); // Set related data to the escorts array
      } else {
        console.error("Error fetching related data:", jsonData.message);
      }
    } catch (error) {
      console.error("Error fetching related data:", error);
    }
  };
  useEffect(() => {
    fetchData();
    fetchAllData();
  }, [location.search]);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === JSON.parse(modelDetail?.images)?.length - 1
        ? 0
        : prevIndex + 1
    );
  };

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0
        ? JSON.parse(modelDetail?.images)?.length - 1
        : prevIndex - 1
    );
  };

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          `
https://escortnights.dk/backend-martin/public/api/feedback/user/${modelDetailId}`
        );
        const data = await response.json();
        if (data.status && data.data.feedbacks) {
          // Remove duplicate testimonials based on a unique property (e.g., ID)
          const uniqueTestimonials = Array.from(
            new Map(data.data.feedbacks.map((item) => [item.id, item])).values()
          );
          setTestimonials(uniqueTestimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, [modelDetailId]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // Show arrows for navigation
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024, // For screens up to 1024px wide
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);

  const wordLimit = 100;

  useEffect(() => {
    if (modelDetail?.about?.split(" ").length > wordLimit) {
      setShouldShowReadMore(true);
    } else {
      setShouldShowReadMore(false);
    }
  }, [modelDetail?.about]);

  return (
    <div className="container mx-auto">
      <section style={{ marginTop: "4vw" }}>
        <div className="container mx-auto p-6 text-white">
          <Flowerright />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="profile-details">
              <div className="profile-image">
                <img
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                  src={`
https://escortnights.dk/backend-martin/public/${modelDetail?.main_image}`}
                  alt="Profile"
                  className="rounded-lg mx-auto"
                />
                <Flower />
              </div>
              <div className="profile-info flex justify-between mt-6 profile px-2">
                <div className="one">
                  <div>
                    <strong>{language === "en" ? "AGE" : "ALDER"}</strong>{" "}
                    <br /> {modelDetail?.age !== "" ? modelDetail?.age : ""}
                  </div>
                  <div>
                    <strong>{language === "en" ? "HEIGHT" : "HØJDE"}</strong>
                    <br />{" "}
                    {modelDetail?.height !== "" ? modelDetail?.height : ""}
                  </div>

                  <div>
                    <strong>
                      {language === "en" ? "HAIR COLOR" : "HÅRFARVE"}
                    </strong>
                    <br />{" "}
                    {modelDetail?.hair_color !== ""
                      ? modelDetail?.hair_color
                      : ""}
                  </div>
                  <div>
                    <strong>{language === "en" ? "CITY" : "BY"}</strong>
                    <br /> {modelDetail?.city !== "" ? modelDetail?.city : ""}
                  </div>
                </div>
                <div className="sec">
                  <div>
                    <strong>{language === "en" ? "BURST" : "BRYST"}</strong>
                    <br /> {modelDetail?.burst !== "" ? modelDetail?.burst : ""}
                  </div>
                  <div>
                    <strong>
                      {language === "en" ? "HAIR COLOR" : "HÅRFARVE"}
                    </strong>
                    <br />{" "}
                    {modelDetail?.weight ? modelDetail?.weight + "lbs" : "N/A"}
                  </div>
                  <div>
                    <strong>{language === "en" ? "EYES" : "ØJNE"}</strong>
                    <br />{" "}
                    {modelDetail?.eye_color !== ""
                      ? modelDetail?.eye_color
                      : ""}
                  </div>
                  <div>
                    <strong>
                      {language === "en" ? "POSTAL CODE" : "POSTNUMMER"}
                    </strong>
                    <br />{" "}
                    {modelDetail?.zip_code !== "" ? modelDetail?.zip_code : ""}
                  </div>
                </div>
              </div>
              <div className="image-gallery flex justify-center flex-wrap items-center gap-10">
                {modelDetail?.images &&
                  JSON.parse(modelDetail?.images)?.map((item, index) => (
                    <img
                      key={index}
                      src={`https://escortnights.dk/backend-martin/public/${item}`}
                      alt={`Image ${index + 1}`}
                      className="rounded-lg cursor-pointer"
                      onClick={() => openModal(index)}
                    />
                  ))}
                {modelDetail?.videos &&
                  JSON.parse(modelDetail?.videos)?.map((video, index) => (
                    <a
                      key={index}
                      target="_blank"
                      href={`https://escortnights.dk/backend-martin/public/${video}`}
                    >
                      <video
                        src={`
https://escortnights.dk/backend-martin/public/${video}`}
                        controls
                        width="200"
                      ></video>
                    </a>
                  ))}
              </div>
              <Flowerright />
              {isModalOpen && (
                <div className="modal-overlay fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
                  <div className="modal-content relative bg-white p-4 rounded-lg">
                    <FaTimes
                      className="absolute top-4 right-4 text-xl cursor-pointer"
                      onClick={closeModal}
                    />
                    <div className="modelimagepopup">
                      <img
                        src={
                          JSON.parse(modelDetail?.images) &&
                          `https://escortnights.dk/backend-martin/public/${
                            JSON.parse(modelDetail?.images)?.[currentImageIndex]
                          }`
                        }
                        alt={`Image ${currentImageIndex + 1}`}
                        className="rounded-lg w-full h-auto"
                      />
                    </div>
                    <div className="modal-navigation flex justify-between mt-4">
                      <FaChevronLeft
                        className="cursor-pointer text-2xl"
                        onClick={showPreviousImage}
                      />
                      <FaChevronRight
                        className="cursor-pointer text-2xl"
                        onClick={showNextImage}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-12 space-y-6">
                <div className="location-info text-center space-y-2">
                  <div
                    style={{
                      borderBottom: "1px solid gray",
                      marginBottom: "20px",
                    }}
                    className="flex justify-between items-center text-lg location pb-2"
                  >
                    <h2>
                      <FaMapMarkerAlt className="mr-2" />{" "}
                      <span>
                        {modelDetail?.address
                          ? modelDetail?.address
                          : language === "en"
                          ? "No Location"
                          : "Ingen placering"}
                      </span>
                    </h2>
                    <div className="flex justify-center items-center text-lg whatsappcall">
                      <span className="mr-2">{modelDetail?.phone_number}</span>
                      <a
                        href={
                          modelDetail?.phone_number
                            ? `https://wa.me/${modelDetail?.phone_number}`
                            : "#"
                        }
                        className="text-white hover:text-gray-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaWhatsapp className="text-2xl" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="ratings">
                <h1
                  className="text-white text-3xl font-bold mt-4 text-start"
                  style={{
                    fontFamily: "Recoleta-Regular",
                    fontWeight: "400",
                    fontSize: "3vw",
                  }}
                >
                  {modelDetail?.name}
                </h1>
                <p className="mt-4 mb-4 text-gray-300 text-start">
                  {modelDetail?.about}
                </p>
                {/* Read More Button */}
                {/* {shouldShowReadMore && (
          <button
            className="text-red-500 font-semibold"
            onClick={toggleReadMore}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )} */}
                {/* <h2
                  style={{
                    fontSize: "17px",
                    marginBottom: "8px",
                    fontFamily: "Recoleta-Regular",
                  }}
                  className="text-white "
                >
                  Service Popularity
                </h2>
                <div className="max-w-full bg-gray-700 rounded-full h-4">
                  <div
                    className=" h-4 rounded-full"
                    style={{ width: "85%", backgroundColor: "#990000" }}
                  ></div>
                </div>

                <h2
                  style={{
                    fontSize: "17px",
                    marginBottom: "8px",
                    fontFamily: "Recoleta-Regular",
                  }}
                  className="text-white mt-4"
                >
                  Client Satisfaction
                </h2>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className=" h-4 rounded-full"
                    style={{ width: "85%", backgroundColor: "#990000" }}
                  ></div>
                </div>

                <h2
                  style={{
                    fontSize: "17px",
                    marginBottom: "8px",
                    fontFamily: "Recoleta-Regular",
                  }}
                  className="text-white  mt-4"
                >
                  Booking Trusts
                </h2>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className=" h-4 rounded-full"
                    style={{ width: "85%", backgroundColor: "#990000" }}
                  ></div>
                </div>

                <h2
                  style={{
                    fontSize: "17px",
                    marginBottom: "8px",
                    fontFamily: "Recoleta-Regular",
                  }}
                  className="text-white mt-4"
                >
                  Experience Dedication
                </h2>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className=" h-4 rounded-full"
                    style={{ width: "85%", backgroundColor: "#990000" }}
                  ></div>
                </div> */}
              </div>

              {/* <div className="booking-form">
                <h2 style={{ fontFamily: "Recoleta-Regular" }}>Feedback</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="input-container">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <label>Name</label>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="input-container">
                      <textarea
                        name="message"
                        rows="6"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                      <label>Additional Details</label>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="rating-container input-container">
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star ${
                              formData.rating >= star ? "selected" : ""
                            }`}
                            onClick={() => handleRatingChange(star)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <label>Rating</label>
                    </div>
                  </div>
                  <button type="submit" className="submit-button">
                    Submit
                  </button>
                </form>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <div className=" mt-24 flex justify-center gap-4 flex-shrink-0 p-4">
        <div className="flex flex-wrap gap-5 justify-center">
          {cardRelatedData?.map((item, index) => (
            <Link
              to={`/details?guid=${item.guid}`} // Navigate to the next page with `guid` in the query
              key={item.id} // Unique key for each image component
            >
              <Images
                src={item.media[0]?.original_url || "../assets/default.png"} // Use original_url or fallback to a default image
                title={item.name} // Pass the escort's name as the title
                name={`img${index + 1}`} // Unique name for each image (if needed)
                animation={index % 2 === 0 ? "fade" : "zoom-in"} // Simple logic for alternating animations
              />
            </Link>
          ))}
          <NewRightImagesFlover />
          <NewLeftImagesFlover />
        </div>
      </div>
      <Flower />

      <section>
        {testimonials.length > 1 ? (
          <>
            <h1
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
            <div className="testimonial-slider">
              <Slider {...settings}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="testimonial">
                    {/* Display testimonial details */}
                    <p>{testimonial.message}</p>
                    <div className="testimonial-rating">
                      {"★".repeat(testimonial.rating)}
                      {"☆".repeat(5 - testimonial.rating)}
                    </div>
                    <h4 style={{ fontWeight: "700" }}>{testimonial.name}</h4>
                  </div>
                ))}
              </Slider>
            </div>
          </>
        ) : (
          <p></p>
        )}

        <br />
        <br />
        <br />
        <Flowerright />

        <ContactUs />
        <Footer />
      </section>
    </div>
  );
};

export default Detail;
