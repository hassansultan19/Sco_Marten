import Images from "../components/Images.jsx";
import NewLeftImagesFlover from "../components/NewLeftImagesFlover.jsx";
import NewRightImagesFlover from "../components/NewRightImagesFlover";
import Footer from "../components/Footer.jsx";
import Flower from "../components/Flower.jsx";
import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext.jsx";
import { useEffect, useState } from "react";

const Detail = () => {
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://escortnights.dk/backend-martin/public/api/escort/featured"
        );
        const jsonData = await response.json();

        if (jsonData.status) {
          setCardData(jsonData.data.escorts);
        } else {
          console.error("Error fetching data:", jsonData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const { language } = useLanguage();
  return (
    <div className="container mx-auto">
      <Flower />
      <h1
        style={{ fontFamily: "Recoleta-Regular" }}
        className="text-center text-2xl mt-20 text-white"
      >
        {language === "en" ? "Choose Your Partners" : "Vælg dine partnere"}
      </h1>

      <div className="flex flex-wrap gap-5 min-h-screen h-full justify-center">
        {cardData.map((item, index) => (
          <Link
            to={`/details?guid=${item.guid}`}
            key={item.id}
            className="relative"
          >
            {item?.user_package?.id && (
              <div className="absolute top-2 right-2 z-10 bg-yellow-500 text-black text-xs font-bold py-1 px-3 rounded-full">
                FEATURED
              </div>
            )}
            <Images
              src={`
https://escortnights.dk/backend-martin/public/${item.main_image}`}
              title={item.name}
              guid={item.guid}
              name={`img${index + 1}`}
              animation={index % 2 === 0 ? "fade" : "zoom-in"}
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
