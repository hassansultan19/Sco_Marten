import { useEffect, useState } from "react";
import ContactUs from "../components/ContactUs";
import Flower from "../components/Flower.jsx";
import Flowerright from "../components/Flowerright.jsx";
import Footer from "../components/Footer";
import Images from "../components/Images.jsx";
import NewLeftImagesFlover from "../components/NewLeftImagesFlover.jsx";
import NewRightImagesFlover from "../components/NewRightImagesFlover.jsx";
import "../pages/Home.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import axios from "axios";
import { FaTruckLoading } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";

const Home = () => {
  const { language } = useLanguage();
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [filterInterest, setFilterInterest] = useState(null);
  const [address, setAddress] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sloading, setsLoading] = useState(false);
  const handleSearch = async () => {
    const authToken = sessionStorage.getItem("authToken");
    setsLoading(true)
    try {
      const response = await fetch(
        `https://martinbackend.tripcouncel.com/api/escort/search?sex=${sex}&age=${age}&address=${address}&interests=${filterInterest}&zip_code=${zipcode}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setsLoading(false)

    }
  };

  const [cardData, setCardData] = useState([]);
  const [cardAllData, setCardAllData] = useState([]);
  const [cardAllNormalData, setCardAllNormalData] = useState([]);
  const [interest, setInterest] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://martinbackend.tripcouncel.com/api/auth/interests`
        );


        if (response.data && Array.isArray(response.data.data.interests)) {
          setInterest(response.data.data.interests);
        } else {
          console.error("Unexpected data format:", response.data);
        }

        console.log("interest", response.data.data.interests);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://martinbackend.tripcouncel.com/api/escort/featured"
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
        setLoading(true); // Start loader
        const response = await fetch(
          "https://martinbackend.tripcouncel.com/api/escort/all"
        );
        const jsonData = await response.json();

        if (jsonData.status) {
          setCardAllData(jsonData.data.escorts); // Set card data
        } else {
          console.error("Error fetching data:", jsonData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loader
      }
    };

    fetchAllData();
  }, []);
  useEffect(() => {

    const fetchAllNormalData = async () => {
      try {
        const response = await fetch(
          "https://martinbackend.tripcouncel.com/api/escort/normal?page_size=100"
        );
        const jsonData = await response.json();

        if (jsonData.status) {
          setCardAllNormalData(jsonData.data.escorts);
        } else {
          console.error("Error fetching data:", jsonData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllNormalData();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const totalPages = Math.ceil(results.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedResults = results.slice(startIndex, endIndex);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container mx-auto">
      <section style={{ padding: "30px" }} >
      
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={20}
      slidesPerView={5}
      navigation
      pagination={{ clickable: true }}
      className="mySwiper"
      breakpoints={{
        // Breakpoints for responsiveness
        320: {
          slidesPerView: 1, // 1 slide for small screens (e.g., mobile)
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 2, // 2 slides for medium-small screens
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 3, // 3 slides for tablets
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 4, // 4 slides for small desktops
          spaceBetween: 20,
        },
        1280: {
          slidesPerView: 5, // 5 slides for large desktops
          spaceBetween: 20,
        },
      }}
    >
      {cardAllNormalData.map((item, index) => {
        const backgroundUrl =
          item.media && item.media[0]?.original_url
            ? item.media[0].original_url
            : "default-image-url.jpg";

        return (
          <SwiperSlide key={index}>
            <Link
              to={`/details?guid=${item.guid}`}
              className="carousel-item bg-1"
              style={{
                backgroundImage: `url(${backgroundUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="chota">
                <h2 className="text-2xl text-center">{item.name}</h2>
                <button
                  style={{
                    marginTop: "10px",
                    backgroundColor: "rgb(153, 0, 0)",
                    border: "none",
                    color: "white",
                    fontSize: "16px",
                    padding: "6px 21px",
                    borderRadius: "9px",
                  }}
                >
                  More Details
                </button>
              </div>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  
      </section>
      <section style={{ padding: "30px" }} className="filterNew">
        <div className="coloumm flex justify-center gap-10 drop-down-main">
          <h2
            style={{ fontFamily: "Recoleta-Regular" }}
            className="text-white text-center p-2 text-3xl mb-2"
          >
            {language === "en"
              ? "Find An Escort In Your Area"
              : "Find en escort eller massage pige i dit område"}
          </h2>


          <div
            className="flex items-center gap-9 wrap-isp"
            style={{ justifyContent: "center" }}
          >
            <div className="text-start drop">
              <p className="text-white mx-1">
                {language === "en" ? "Sex" : "Køn"}
              </p>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="dropdown w-48 bg-black text-white"
              >
                <option value="">
                  {language === "en" ? "Select Sex" : "Vælg Køn"}
                </option>
                <option value="Woman">
                  {language === "en" ? "Woman" : "Kvinde"}
                </option>
                <option value="Man">
                  {language === "en" ? "Man" : "Mand"}
                </option>
                <option value="Trans">
                  {language === "en" ? "Trans" : "Trans"}
                </option>
              </select>
            </div>


            <div className="text-start drop">
              <p className="text-white mx-1">{language === 'en' ? 'Service' : 'Service'}</p>
              <select
                value={filterInterest}
                onChange={(e) => setFilterInterest(e.target.value)}
                className="dropdown w-48 bg-black text-white"
              >
                <option value="">
                  {language === "en" ? "All" : "Alle"}
                </option>
                {interest.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>



            <div className="text-start drop">
              <p className="text-white mx-1">
                {language === "en" ? "Age" : "Alder"}
              </p>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="dropdown w-48 bg-black text-white"
              >
                <option value="">
                  {language === "en" ? "All" : "Alle"}
                </option>
                <option value="18">18</option>
                <option value="25">25</option>
                <option value="30">35</option>
                <option value="45">45</option>
                <option value="60">60</option>
              </select>
            </div>

            <div className="text-start drop">
              <p className="text-white mx-1">{language === 'en' ? 'Zip code / City name' : 'Soge / Bynavn'}</p>
              <input type="text" className="dropdown w-48 rounded-lg  bg-black text-white m-[10px] px-[13px] py-[10px]" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
            </div>
            <div className="flex justify-center mt-6 drop">
              <button
                disabled={sloading}
                className="btun btn w-40"
                style={{
                  backgroundColor: "#990000",
                  border: "none",
                  color: "white",
                  fontSize: "16px",
                }}
                onClick={handleSearch}
              >
                {sloading ? <LuLoader className="w-5 h-5 animate-spin" /> : language === "en" ? "Submit" : "Indsend"}
              </button>
            </div>
          </div>
        </div>


      </section>

      <section style={{ padding: "30px" }}>
        <div>

          <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-5">
            {displayedResults.length > 0 ? (
              displayedResults.map((escort, index) => (
                <Link
                  to={`/details?guid=${escort.guid}`}
                  className="card w-full shadow-xl m-2 mt-4"
                  style={{
                    boxShadow: "#990000 0px 1px 0px 1px ,#990000 1px 0px 1px 1px",
                    backgroundColor: "#111",
                  }}
                  key={escort.id}
                >
                  <figure>
                    <img
                      className="w-full h-72 object-cover"
                      title={escort.name}
                      src={escort.media[0]?.original_url || "../assets/default.png"}
                      alt={escort.name}
                      name={`img${index + 1}`}
                    />
                  </figure>
                  <div className="card-body text-start">
                    <h2 className="card-title text-white">{escort.name}</h2>
                    <p className="text-white">{escort.address}</p>
                    <div className="card-actions flex justify-between items-center">
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "#990000",
                        }}
                        className="btn text-white all-btn-hover"
                        onClick={() =>
                          document.getElementById(`my_modal_${index}`).showModal()
                        }
                      >
                        {language === "en" ? "Book Now" : "Book nu"}
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-white">
                {language === "en"
                  ? "No results found."
                  : "Ingen resultater fundet."}
              </p>
            )}
          </div>

          {/* Pagination Controls */}
          {results.length > 0 && (
            <div className="flex gap-x-2 items-center  justify-center mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${currentPage === 1
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-red-700 hover:bg-red-800 text-white"
                  }`}
              >
                Previous
              </button>

              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${currentPage === totalPages
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-red-700 hover:bg-red-800 text-white"
                  }`}
              >
                Next
              </button>
            </div>
          )}
        </div>


        <Flower />
        <h1
          style={{ fontFamily: "Recoleta-Regular" }}
          className="text-center text-2xl mt-20 text-white"
        >
          {language === "en" ? "Choose Your Partners" : "Vælg dine partnere"}
        </h1>
        <h1
          style={{ fontFamily: "Recoleta-Regular" }}
          className="text-center text-4xl mt-5 mb-10 text-white"
        >
          {language === "en"
            ? "Find Advert In Your Area"
            : "Find Advert i dit område"}
        </h1>

        {loading ? (

          <div className="loader flex justify-center items-center">
            <div className="spinner">
              <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 justify-center">
              {
                cardAllData.map((escort, index) => (
                  <Link
                    to={`/details?guid=${escort.guid}`}
                    className="card w-full shadow-xl m-2 mt-4"
                    style={{
                      boxShadow: "#990000 0px 1px 0px 1px ,#990000 1px 0px 1px 1px",
                      backgroundColor: "#111",
                    }}
                    key={escort.id}
                  >
                    <figure>
                      <img
                        src={escort.media[0]?.original_url || "../assets/default.png"}
                        title={escort.name}
                        alt={escort.name}
                        name={`img${index + 1}`}
                        className="w-full h-72 object-cover"
                      />
                    </figure>
                    <div className="card-body text-start">
                      <h2 className="card-title text-white">{escort.name}</h2>
                      <p className="text-white">{escort.address}</p>
                      <div className="card-actions flex justify-between items-center">
                        <button
                          style={{ border: "none", backgroundColor: "#990000" }}
                          className="btn text-white all-btn-hover"
                          onClick={() =>
                            document.getElementById(`my_modal_${index}`).showModal()
                          }
                        >
                          {language === "en" ? "Book Now" : "Book nu"}
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

          </div>
        )}

        <Flower />

        <Flowerright />
        <ContactUs />
        <Footer />
      </section>
    </div>
  );
};

export default Home;
