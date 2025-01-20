import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useScrollRestoration from "./components/ScrollComp/useScrollRestoration";
import ScrollToTop from "./components/ScrollComp/ScrollToTop";
import './i18n';
import { LanguageProvider } from "./LanguageContext";
import { useEffect } from "react";
import { useLocationStore } from "./store/useLocationStore";

function App() {
  useScrollRestoration();
  const {userLocation,setUserLocation} =useLocationStore()
  const getUserLocation= () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation(latitude, longitude);


            },
            (error) => console.error(error),
            { enableHighAccuracy: true }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

  useEffect(() => {
    if (userLocation == null) { 
      getUserLocation()
    }
  }, [])
  
console.log('userLocation', userLocation)

  

  return (
    <>
      <LanguageProvider>
        <Navbar/>
        <ScrollToTop/>
        <Outlet />
      </LanguageProvider>
    </>
  )
}

export default App;
