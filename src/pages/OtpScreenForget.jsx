import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // For extracting email from the URL
import "./Login.css"; // Assuming your CSS is in a separate file called Login.css
import Swal from "sweetalert2";
import OTPInput from "react-otp-input";

const OtpScreenForget = () => {
  const navigate = useNavigate(); // For redirection after registration

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds countdown
  const inputRefs = useRef([]);
  const { email } = useParams(); // Extract email from the URL
  const VERIFY_API_URL =
    "https://martinbackend.tripcouncel.com/api/auth/verify-otp";
  const RESEND_API_URL =
    "https://martinbackend.tripcouncel.com/api/auth/send-otp";
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
  });
  // Handle input change
  const handleChange = (otp) => {
    setFormData({
      ...formData,
      otp, // Update the `otp` field directly
    });
  };

  // Handle backspace
  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const code = otp.join("");

    // Prepare the API body
    const requestBody = {
      email,
      otp: formData.otp,
      type: 1, // 0 for email verification, 1 for forgot password
      is_user: 0,
    };

    // Make API request
    setLoading(true);
    try {
      const response = await fetch(VERIFY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        navigate(`/resetpassword/${email}`);
        // Handle success
        // alert('Verification successful!');
        // Redirect or handle post-verification logic here
      } else {
        // Handle error response
        alert(`Verification failed: ${result.message}`);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during OTP verification:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Handle resend code functionality
  const handleResendCode = async () => {
    // Prepare the API body
    const requestBody = {
      email,
      type: 0, // 0 for email verification, 1 for forgot password
      is_user: 0,
    };

    // Make API request
    try {
      const response = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      if (response.ok) {
        // Successfully sent OTP, disable resend button for 1 minute
        setIsResendDisabled(true);
        setResendTimer(60); // Set countdown timer to 60 seconds

        // Show success popup
        Swal.fire({
          title: "OTP Resent!",
          text: "The OTP has been successfully resent to your email.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            content: "swal-content",
            confirmButton: "swal-confirm-button",
          },
        });
      } else {
        // Handle error response with popup
        Swal.fire({
          title: "Failed to Resend OTP",
          text: result.message || "Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error during resend code:", error);
      // Show error popup
      Swal.fire({
        title: "An Error Occurred",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Countdown effect for the resend button
  useEffect(() => {
    if (isResendDisabled && resendTimer > 0) {
      const countdown = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);

      // Cleanup interval on component unmount or when the timer reaches 0
      return () => clearInterval(countdown);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }
  }, [isResendDisabled, resendTimer]);

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
                Verify Your <br /> Account!
              </h2>
            </div>
          </div>

          {/* Centered Login Form */}
          <div className="login-box">
            <h1>Verify</h1>
            <form onSubmit={handleSubmit}>
              <div className="otp-inputs">
                <OTPInput
                  //  name="otp"
                  name="otp"
                  id="otp"
                  value={formData.otp}
                  onChange={(e) => handleChange(e)}
                  numInputs={5}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                />
                {/* {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(e, index)}
                                        onKeyDown={(e) => handleBackspace(e, index)}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        required
                                    />
                                ))} */}
              </div>

              <div className="forgot-password">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResendDisabled}
                >
                  {isResendDisabled ? `Resend in ${resendTimer}s` : "Resend?"}
                </button>
              </div>
              <button
                type="submit"
                className="login-btn all-btn-hover"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpScreenForget;
