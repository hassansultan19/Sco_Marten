import { useState } from "react";
import "./Login.css"; // Assuming your CSS is in a separate file called Login.css
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate(); // For redirection after registration

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://escort.odhostestingweblinks.com/api/auth/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare the API body
    const requestBody = {
      email,
      password,
      is_user: 0,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok && result.status) {
        // Handle successful login
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
        }).then(() => {
          // Save token in sessionStorage
          if (result.data && result.data.token) {
            sessionStorage.setItem("authToken", result.data.token);
            sessionStorage.setItem("guid", result.data.guid);
            sessionStorage.setItem("name", result.data.name);
            sessionStorage.setItem("email", result.data.email);
            sessionStorage.setItem("featured", result.data.featured);
          }

          // Redirect to the home page after the user clicks 'OK'
          navigate("/dashboard");
        });
      } else {
        // Handle error response using SweetAlert2
        Swal.fire({
          title: "Login Failed",
          text: result.message || "Invalid credentials. Please try again.",
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
    } catch (error) {
      setLoading(false);
      console.error("Error during login:", error);

      // Show error popup with SweetAlert2
      Swal.fire({
        title: "An Error Occurred",
        text: "Something went wrong. Please try again.",
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
                Login Your <br /> Account!
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
                <Link to="/forget">Forgot Password?</Link>
              </div>
              <button
                type="submit"
                className="login-btn all-btn-hover"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
