import { useState } from "react";
import Swal from "sweetalert2";
import "./Login.css"; // Assuming your CSS is in a separate file called Login.css
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const RESET_API_URL =
    "https://escort.odhostestingweblinks.com/api/auth/reset-password";
  const { email } = useParams(); // Extract email from the URL

  const [password, setPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [loading, setLoading] = useState(false); // State to manage loading state

  const navigate = useNavigate(); // Initialize navigate for routing

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // Show error if passwords do not match
      Swal.fire({
        title: "Passwords do not match!",
        text: "Please ensure the passwords are the same.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    // Prepare API body
    const requestBody = {
      email,
      password,
      new_password: password,
      is_user: 0,
    };

    try {
      // Make API request
      const response = await fetch(RESET_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok) {
        // Success - Show SweetAlert2 popup and navigate to login
        Swal.fire({
          title: "Password Reset Successful!",
          text: "You can now log in with your new password.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            content: "swal-content",
            confirmButton: "swal-confirm-button",
          },
        }).then(() => {
          // Redirect to login screen
          navigate("/login");
        });
      } else {
        // Error - Show SweetAlert2 error popup
        Swal.fire({
          title: "Failed to Reset Password",
          text: result.message || "Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error during password reset:", error);
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
                Reset Your <br /> Password!
              </h2>
            </div>
          </div>

          <div className="login-box">
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
              {/* <input
                                type="email"
                                placeholder='Enter your email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            /> */}
              <input
                type="password"
                placeholder="Enter new password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="submit"
                className="login-btn all-btn-hover"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
