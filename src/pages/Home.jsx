import { useEffect, useState } from "react";
import Cards from "../components/Card";
// import Carousel from "../components/Carousel";
import ContactUs from "../components/ContactUs";
import Flower from "../components/Flower.jsx";
import Flowerright from "../components/Flowerright.jsx";
import Footer from "../components/Footer";
import Images from "../components/Images.jsx";
import NewLeftImagesFlover from "../components/NewLeftImagesFlover.jsx";
import NewRightImagesFlover from "../components/NewRightImagesFlover.jsx";
import TestimonialSlider from "../components/Testimonials.jsx";
import "../pages/Home.css";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useLanguage } from "../LanguageContext.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import axios from "axios";

const Home = () => {
  const { language } = useLanguage(); // Access language context

  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [filterInterest, setFilterInterest] = useState(null);
  const [address, setAddress] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const handleSearch = async () => {
    const authToken = sessionStorage.getItem("authToken");

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
      setResults(data.data); // Access the 'data' property here
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
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

        // Check if the data is in the expected format
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
    // Fetch data from the API
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

  return (
    <div className="container mx-auto">
      <section>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={5} // Display 5 models per slide
          navigation
          pagination={{ clickable: true }}
          className="mySwiper"
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

          {/* Dropdown 1 */}
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

            {/* Dropdown 2 */}
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



            {/* Dropdown 3 */}
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
                <option value="30">45</option>
                <option value="30">60</option>
              </select>
            </div>
            <div className="text-start drop">
              <p className="text-white mx-1">{language === 'en' ? 'Zip code / City name' : 'Soge / Bynavn'}</p>
              <input type="text" className="dropdown w-48 rounded-lg  bg-black text-white m-[10px] px-[13px] py-[10px]" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
            </div>
            {/* Submit Button */}
            <div className="flex justify-center mt-6 drop">
              <button
                className="btun btn w-full"
                style={{
                  backgroundColor: "#990000",
                  border: "none",
                  color: "white",
                  fontSize: "16px",
                }}
                onClick={handleSearch}
              >
                {language === "en" ? "Submit" : "Indsend"}
              </button>
            </div>
          </div>
        </div>

        {/* Display results */}
      </section>

      <section style={{ padding: "30px" }}>
        <div
          className="results"
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          {results.length > 0 ? (
            results.map((escort) => (

              <Link to={`/details?guid=${escort.guid}`}
                className="card  w-96 shadow-xl m-2 mt-4"
                style={{
                  boxShadow: "#990000 0px 1px 0px 1px ,#990000 1px 0px 1px 1px",
                  backgroundColor: "#111",
                }}
                key={escort.id}
              >
                {/* Added margin for spacing */}
                <figure>
                  {escort.media.map((mediaItem) => (
                    <img
                      style={{ width: "300px", height: "300px" }}
                      className="rounded-[20px] p-3"
                      key={mediaItem.id}
                      src={mediaItem.original_url}
                      alt={escort.name}
                    />
                  ))}
                </figure>
                <div className="card-body text-start">
                  {" "}
                  {/* Align text to the start (left) */}
                  <h2 className="card-title text-white">{escort.name}</h2>
                  <p className="text-white">{escort.address}</p>
                  <div className="card-actions flex justify-between items-center">
                    {" "}
                    {/* Align the button and rating side by side */}
                    {/* Rating Section */}
                    {/* <div className="flex items-center">
                      <span className="text-yellow-500 flex">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </span>
                      <span className="ml-2 text-white">4.5</span> 
                    </div> */}
                    {/* Buy Now Button */}
                    <button
                      style={{ border: "none", backgroundColor: "#990000" }}
                      className="btn  text-white all-btn-hover"
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
                 
                  <button
                    style={{ border: "none", backgroundColor: "#990000" }}
                    className="btn text-white all-btn-hover"
                    onClick={() =>
                      document.getElementById(`my_modal_${index}`).showModal()
                    }
                  >
                    <Link to={`/details?guid=${item.guid}`}>
                      {language === "en" ? "Book Now" : "Book nu"}
                    </Link>
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
          // Show loader while loading
          <div className="loader flex justify-center items-center">
            <div className="spinner">
              {/* Add your spinner/loader here */}
              <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          // Show content when loading is complete
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
        )}
        {/* <div
          style={{ alignItems: "center" }}
          className="mt-48 flex flex-col-reverse lg:flex-row justify-evenly   items-center lg:items-start gap-[7vw]"
        >
          <div className="txt-size text-center lg:text-left">
            <h1
              style={{ fontFamily: "Recoleta-Regular" }}
              className="text-white text-xl lg:text-6xl  mb-4"
            >
              {language === "en"
                ? "About Us for Massage "
                : "Om os til massage"}{" "}
              <br className="hidden lg:block" />{" "}
              {language === "en" ? "and Escort Services" : "og Escort Services"}
            </h1>
            <p className="text-sm lg:text-base mb-6">
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

          <div
            className="relative border rounded-lg p-1 z-[999]"
            style={{ maxWidth: "380px" }}
          >
            <img
              className="img-index absolute top-[-7vw] right-[12vw] z-[-999]"
              src="./assests/04 1.png"
              alt=""
            />
            <img
              src="../assests/Rectangle 15.png "
              alt=""
              className="w-full h-auto rec-img "
            />

            <img
              src="../assests/Rectangle 14.png"
              alt=""
              className="absolute top-5 right-[-30px] w-[80px] lg:w-[130px]"
            />
          </div>
        </div> */}
        <Flower />
        {/* <h1
          style={{ fontFamily: "Recoleta-Regular" }}
          className="text-center text-2xl mt-10 text-white"
        >
          {language === "en" ? "Testimonials" : "Udtalelser"}{" "}
        </h1>
        <h1
          style={{ fontFamily: "Recoleta-Regular" }}
          className="text-center text-4xl text-white mb-5"
        >
          {language === "en"
            ? "What Our Clients Say"
            : "Hvad vores kunder siger"}{" "}
        </h1>

        <TestimonialSlider /> */}
        <Flowerright />
        <ContactUs />
        <Footer />
      </section>
    </div>
  );
};

export default Home;
