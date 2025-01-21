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
  const {userLocation,setUserLocation,setCardAllData,setCardLoading} =useLocationStore()
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
  

  useEffect(() => {

    const fetchAllData = async () => {
      if (userLocation !== null) {
        try {
          setCardLoading(true);
          const response = await fetch(
            `https://martinbackend.tripcouncel.com/api/escort/all?latitude=${userLocation?.lat}&longitude=${userLocation?.lng}`
          );
          const jsonData = await response.json();

          if (jsonData.status) {
            setCardAllData(jsonData.data.escorts);
          } else {
            console.error("Error fetching data:", jsonData.message);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setCardLoading(false);
        }
      }
    };

    fetchAllData();
  }, [userLocation]);

  

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
