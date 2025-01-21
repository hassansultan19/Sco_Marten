// import Carousel from "../components/Carousel";
import Images from "../components/Images.jsx";
import NewLeftImagesFlover from "../components/NewLeftImagesFlover.jsx";
import NewRightImagesFlover from "../components/NewRightImagesFlover";
import Footer from "../components/Footer.jsx";
import Flower from "../components/Flower.jsx";
import Cards from "../components/Card.jsx";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../LanguageContext.jsx";

const Detail = () => {
  const [cardData, setCardData] = useState([]);
  const [cardAllData, setCardAllData] = useState([]);
  const { language } = useLanguage(); // Access language context

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://192.168.18.83:8000/api/escort/featured"
        );
        const jsonData = await response.json();

        // Check if the response is successful
        if (jsonData.status) {
          setCardData(jsonData.data.escorts); // Set cardData to the escorts array
        } else {
          console.error("Error fetching data:", jsonData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    // Fetch data from the API
    const fetchAllData = async () => {
      try {
        const response = await fetch(
          "http://192.168.18.83:8000/api/escort/all"
        );
        const jsonData = await response.json();

        // Check if the response is successful
        if (jsonData.status) {
          setCardAllData(jsonData.data.escorts); // Set cardData to the escorts array
        } else {
          console.error("Error fetching data:", jsonData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="container mx-auto">
      {/* <div className="detail-us-img ">
        <div>
          <h1 style={{fontFamily:"Recoleta-Regular"}}>{language === 'en' ? 'Models' : 'Modeller'}</h1>
          <p>{language === 'en' ? 'Home' : 'Hjem'}/ <span style={{color:'red'}}>{language === 'en' ? 'Models page' : 'Modeller side'}</span></p>
        </div>
      </div> */}
      {/* <div>
        <h1
          style={{ fontFamily: "Recoleta-Regular" }}
          className="text-center text-4xl mt-20 text-white"
        >
          {language === "en"
            ? "Most Demanding Models"
            : "Mest krævende modeller"}
        </h1>
      </div>

      <Flower />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {cardData.map((item, index) => (
          <div
            className="card w-96 shadow-xl m-2 mt-4"
            key={item.id}
            style={{
              boxShadow: "#990000 0px 1px 0px 1px ,#990000 1px 0px 1px 1px",
              backgroundColor: "#111",
            }}
          >
            <figure>
              <img
                className="rounded-[20px] p-3"
                src={
                  item.media[0]?.original_url ||
                  "https://via.placeholder.com/150"
                }
                alt={item.name}
              />
            </figure>
            <div className="card-body text-start">
              <h2 className="card-title text-white">{item.name}</h2>
              <p className="text-white">{item.about}</p>
              <div className="card-actions flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-yellow-500 flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < 4 ? "text-yellow-500" : "text-gray-400"}
                      />
                    ))}
                  </span>
                  <span className="ml-2 text-white">4.5</span>{" "}
                </div>
                <button
                  style={{ border: "none", backgroundColor: "#990000" }}
                  className="btn text-white all-btn-hover"
                  onClick={() =>
                    document.getElementById(`my_modal_${index}`).showModal()
                  }
                >
                  <Link to={`/details?guid=${item.guid}`}>Book Now</Link>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div> */}
      <Flower />
      <h1
        style={{ fontFamily: "Recoleta-Regular" }}
        className="text-center text-2xl mt-20 text-white"
      >
        Choose Your Partners
      </h1>
      <h1
        style={{ fontFamily: "Recoleta-Regular" }}
        className="text-center text-4xl mt-5 mb-10 text-white"
      >
        Find Advert In Your Area
      </h1>

      <div className="flex flex-wrap gap-5 justify-center">
        {cardAllData.map((item, index) => (
          <Link
            to={`/details?guid=${item.guid}`} // Navigate to the next page with `guid` in the query
            key={item.id} // Unique key for each image component
          >
            <Images
              src={item.media[0]?.original_url || "../assets/default.png"} // Use original_url or fallback to a default image
              title={item.name} // Pass the escort's name as the title
              guid={item.guid}
              name={`img${index + 1}`} // Unique name for each image (if needed)
              animation={index % 2 === 0 ? "fade" : "zoom-in"} // Simple logic for alternating animations
            />
          </Link>
        ))}
        <NewRightImagesFlover />
        <NewLeftImagesFlover />
      </div>
      <Footer />
    </div>
  );
};

export default Detail;
