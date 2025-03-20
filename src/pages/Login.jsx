import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { useLanguage } from "../LanguageContext";

const Login = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://192.168.18.74:800/api/auth/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestBody = {
      email,
      password,
      is_user: 0,
    };

    try {
      const response = await axios.post(API_URL, requestBody);

      const result = await response.data;
      setLoading(false);

      Swal.fire({
        title: "Login Successful!",
        text: "You have successfully logged in.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          content: "swal-content",
          confirmButton: "swal-confirm-button",
        },
      });
      localStorage.setItem("authToken", result.data.token);
      localStorage.setItem("guid", result.data.guid);
      localStorage.setItem("userId", result.data.id);
      localStorage.setItem("name", result.data.name);
      localStorage.setItem("email", result.data.email);
      localStorage.setItem("featured", result.data.featured);

      navigate("/dashboard");
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      Swal.fire({
        title: "An Error Occurred",
        text: error.response.data.message || error.message,
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          content: "swal-content",
          confirmButton: "swal-confirm-button",
        },
      });
    }
  };
  return (
    <div className="container mx-auto">
      <div className="login-container">
        {/* Full-width Background Image with Overlay */}
        <div className="overlay">
          {/* Left side text */}
          <div className="left-text">
            <div className="logo">
              <img
                style={{ width: "120px", height: "60px", objectFit: "contain" }}
                src="../assests/logo.png"
                alt="Logo"
              />
              <h2 style={{ fontFamily: "Recoleta-Regular" }}>
                {language === "en" ? "Login " : "Log ind"} Your <br /> Account!
              </h2>
              <p>
                Register to access all the features of our services. <br />
                Manage your business in one place. It's free!
              </p>
            </div>
          </div>

          {/* Centered Login Form */}
          <div className="login-box">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="forgot-password">
                <Link to="/forget">
                  {language === "en" ? "Forgot Password?" : "Glemt Adgangskode"}
                </Link>
              </div>
              <button
                type="submit"
                className="login-btn all-btn-hover"
                disabled={loading}
              >
                {loading
                  ? language === "en"
                    ? " Login..."
                    : "Log ind..."
                  : language === "en"
                  ? " Login"
                  : "Log ind"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
