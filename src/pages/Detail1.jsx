import Images from "../components/Images.jsx";
import NewLeftImagesFlover from "../components/NewLeftImagesFlover.jsx";
import NewRightImagesFlover from "../components/NewRightImagesFlover";
import Footer from "../components/Footer.jsx";
import Flower from "../components/Flower.jsx";
import { Link } from "react-router-dom";

import { useLocationStore } from "../store/useLocationStore.js";
import { useLanguage } from "../LanguageContext.jsx";

const Detail = () => {
  const { cardAllData } = useLocationStore();
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
      <h1
        style={{ fontFamily: "Recoleta-Regular" }}
        className="text-center text-4xl mt-5 mb-10 text-white"
      >
        {language === "en"
          ? "Find Advert In Your Area"
          : "Find annonce i dit område"}
      </h1>

      <div className="flex flex-wrap gap-5 min-h-screen h-full justify-center">
        {cardAllData.map((item, index) => (
          <Link to={`/details?guid=${item.guid}`} key={item.id}>
            <Images
              src={item.media[0]?.original_url || "../assets/default.png"}
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
