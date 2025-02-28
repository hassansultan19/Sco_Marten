import { useState } from "react";
import Swal from "sweetalert2";
import "./Login.css"; // Assuming your CSS is in a separate file called Login.css
import { useNavigate } from "react-router-dom";

const Forget = () => {
  const FORGET_API_URL =
    "https://escortnights.dk/backend-martin/public/api/auth/send-otp";
  const [email, setEmail] = useState(""); // State to manage email input
  const [loading, setLoading] = useState(false); // State to manage loading state

  const navigate = useNavigate(); // Initialize navigate for routing

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare API body
    const requestBody = {
      email,
      type: 1, // 1 for forgot password
      is_user: 0,
    };

    try {
      // Make API request
      const response = await fetch(FORGET_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok) {
        // Success - Show SweetAlert2 popup and redirect to verify-otp screen
        Swal.fire({
          title: "OTP Sent!",
          text: "Please check your email for the OTP.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            content: "swal-content",
            confirmButton: "swal-confirm-button",
          },
        }).then(() => {
          // Redirect to verify-otp screen with email as a query parameter
          navigate(`/otpscreenforget/${email}`);
        });
      } else {
        // Error - Show SweetAlert2 error popup
        Swal.fire({
          title: "Failed to Send OTP",
          text: result.message || "Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error during forgot password request:", error);
      // Show error popup
      Swal.fire({
        title: "An Error Occurred",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="login-container">
        <div className="overlay">
          <div className="left-text">
            <div className="logo">
              <img
                style={{ width: "120px", height: "60px", objectFit: "contain" }}
                src="../assests/logo.png"
                alt="Logo"
              />
              <h2 style={{ fontFamily: "Recoleta-Regular" }}>
                Verify Your <br /> Account!
              </h2>
            </div>
          </div>

          <div className="login-box">
            <h1>Verify</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state on change
              />

              <button
                type="submit"
                className="login-btn all-btn-hover"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forget;
