import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function useScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(location.key);
    if (savedPosition) {
      const { x, y } = JSON.parse(savedPosition);
      window.scrollTo(x, y);  // This will scroll without animation
    }

    return () => {
      sessionStorage.setItem(location.key, JSON.stringify({
        x: window.scrollX,
        y: window.scrollY
      }));
    };
  }, [location]);
}

export default useScrollRestoration;