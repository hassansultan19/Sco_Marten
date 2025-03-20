import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/AboutUs.jsx'
import Detail from './pages/Detail.jsx'
import RegistrationForm from "./pages/RegistrationForm.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import BookAnAppointment from "./pages/BookAnAppointment.jsx";
import Detail1 from "./pages/Detail1.jsx";
import OtpScreen from "./pages/OtpScreen.jsx";
import Forget from "./pages/Forget.jsx";
import OtpScreenForget from "./pages/OtpScreenForget.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import PackagesMain from "./pages/PackagesMain.jsx";
import Success from "./pages/Success.jsx";
import PaymentRejected from "./pages/Reject.jsx";

const ScrollManager = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const savedPosition = history.state?.scrollPosition || 0;
    window.scrollTo(0, savedPosition);

    return () => {
      const scrollPosition = window.scrollY;
      history.replaceState({ scrollPosition }, "");
    };
  }, [location]);

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "packages",
        element: <PackagesMain />,
      },
      {
        path: "success",
        element: <Success />,
      },
      {
        path: "cancel",
        element: <PaymentRejected />,
      },
      {
        path: "details",
        element: <Detail />,
      },
      {
        path: "registrationForm",
        element: <RegistrationForm />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "otpscreen/:email",
        element: <OtpScreen />,
      },
      {
        path: "otpscreenforget/:email",
        element: <OtpScreenForget />,
      },
      {
        path: "resetpassword/:email",
        element: <ResetPassword />,
      },
      {
        path: "dashboard",
        element: <UpdateProfile />,
      },
      {
        path: "forget",
        element: <Forget />,
      },
      {
        path: "bookAnAppointment",
        element: <BookAnAppointment />,
      },
      {
        path: "Adverts",
        element: <Detail1 />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
    <ScrollManager>
      <RouterProvider router={router} />
    </ScrollManager>
  </RouterProvider>
);