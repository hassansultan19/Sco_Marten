import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useScrollRestoration from "./components/ScrollComp/useScrollRestoration";
import ScrollToTop from "./components/ScrollComp/ScrollToTop";
import './i18n'; // import the i18n configuration here
import { LanguageProvider } from "./LanguageContext";

function App() {
  useScrollRestoration(); // Use the custom hook
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
