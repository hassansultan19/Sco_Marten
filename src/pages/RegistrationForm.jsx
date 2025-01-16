import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router
import Flower from "../components/Flower";
import Flowerright from "../components/Flowerright";
import Footer from "../components/Footer";
import "../pages/Registration.css";
import apis from "../Service/Index";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegistrationForm = () => {
  const navigate = useNavigate(); // For redirection after registration
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null); // State for main image
  const [videos, setVideos] = useState([]);
  const [passwordShoe,SetPasswordShow]=useState("password")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_code: "+92",
    phone_number: "",
    phone_country_code: "us",
    zip_code: "",
    address: "",
    city: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
    age: "",
    height: "",
    weight: "",
    burst: "",
    about: "",
    user_interests: "",
    hair_color: "",
    images: [],
    videos: [],
    eye_color: "",
    main_image: "", // Main image field
    sex: "", // Updated sex field
    is_user: 0,
  });
  const addressRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Use Google Places API to auto-fill address components
  useEffect(() => {
    if (window.google) {
      // Initialize autocomplete for address input
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressRef.current,
        { types: ["address"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const addressComponents = place.address_components;

        // Initialize variables to store extracted info
        let city = "";
        let state = "";
        let country = "";
        let zip = "";
        let latitude = "";
        let longitude = "";
        let formattedAddress = "";

        // Loop through address components and extract relevant info
        addressComponents.forEach((component) => {
          const componentType = component.types[0];

          switch (componentType) {
            case "locality":
              city = component.long_name;
              break;
            case "administrative_area_level_1":
              state = component.short_name;
              break;
            case "country":
              country = component.long_name;
              break;
            case "postal_code":
              zip = component.long_name;
              break;
            default:
              break;
          }
        });

        // Get formatted address, latitude, and longitude
        formattedAddress = place.formatted_address;
        latitude = place.geometry.location.lat();
        longitude = place.geometry.location.lng();

        // Update the form data with the extracted info
        setFormData((prevData) => ({
          ...prevData,
          address: formattedAddress,
          city,
          state,
          country,
          zip_code: zip,
          latitude,
          longitude,
        }));
      });
    }
    // Update state with city, country, and zip code based on zip_code change
    // Update state with city, country, and address based on zip_code change
    const handleZipChange = async (zipCode) => {
      try {
        // Make a request to a geocoding API (e.g., Google Maps Geocoding API)
        // to get city, country, and address from the zip code.
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=dk-${zipCode}&key=AIzaSyDg6Ci3L6yS5YvtKAkWQjnodGUtlNYHw9Y&libraries=places`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const addressComponents = data.results[0].address_components;
          const formattedAddress = data.results[0].formatted_address;
          let city = "";
          let state = "";
          let country = "";
          let address = formattedAddress;

          addressComponents.forEach((component) => {
            const componentType = component.types[0];
            switch (componentType) {
              case "locality":
                city = component.long_name;
                break;
              case "administrative_area_level_1":
                state = component.short_name;
                break;
              case "country":
                country = component.long_name;
                break;
              default:
                break;
            }
          });

          setFormData((prevData) => ({
            ...prevData,
            city,
            state,
            country,
            address: address.trim(), // Remove trailing whitespace
          }));
        } else {
          // Handle cases where the zip code is invalid or no results are found
          console.error("No results found for the provided zip code.");
          // You might want to display an error message to the user
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        // Handle API request errors
      }
    };

    // Add event listener to the zip_code input field
    const zipCodeInput = document.getElementById("zip_code_input");
    if (zipCodeInput) {
      zipCodeInput.addEventListener("change", (event) => {
        handleZipChange(event.target.value);
      });
    }

    return () => {
      // Remove event listener when the component unmounts
      if (zipCodeInput) {
        zipCodeInput.removeEventListener("change", handleZipChange);
      }
    };
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input change for multiple images
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => prevImages.concat(imageUrls));
    setFormData({
      ...formData,
      images: files, // Set the selected files
    });
  };

  // Handle main image change
  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    setMainImage(URL.createObjectURL(file));
    setFormData({
      ...formData,
      main_image: file, // Set the selected main image file
    });
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration <= 30) {
          resolve(true);
        } else {
          reject(new Error("Video exceeds 30 seconds"));
        }
      };
      video.onerror = () => {
        reject(new Error("Invalid video file"));
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoChange = async (event) => {
    const files = Array.from(event.target.files);
    const validVideos = [];
    const previews = [];

    for (let file of files) {
      try {
        await validateVideoDuration(file);
        previews.push(URL.createObjectURL(file));
        validVideos.push(file);
      } catch (error) {
        console.error(error.message);
        alert(error.message);
      }
    }

    setVideos((prevVideos) => [...prevVideos, ...validVideos]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      videos: [...prevFormData.videos, ...validVideos],
    }));
  };

  const handleRemoveVideo = (index) => {
    setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const [interest, setInterest] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://martinbackend.tripcouncel.com/api/auth/interests`
        );

        // Check if the data is in the expected format
        if (response.data && Array.isArray(response.data.data.interests)) {
          setInterest(response.data.data.interests);
        } else {
          console.error("Unexpected data format:", response.data);
        }

        console.log("interest", response.data.data.interests);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const handleInterestChange = (event, id) => {
    if (event.target.checked) {
      setSelectedInterests([...selectedInterests, id]);
    } else {
      setSelectedInterests(
        selectedInterests.filter((interestId) => interestId !== id)
      );
    }
  };

  const register = async (event) => {
    event.preventDefault();
    setInputError(true);
    setLoading(true);

    let validationErrors = {};

    if (!formData.name) validationErrors.name = "Name is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.password) validationErrors.password = "Password is required";
    if (!formData.confirmPassword)
      validationErrors.confirmPassword = "Confirm Password is required";
    if (!formData.phone_number)
      validationErrors.phone_number = "Phone Number is required";
    if (!formData.city) validationErrors.city = "City is required";
    if (!formData.hair_color)
      validationErrors.hair_color = "Hair Color is required";
    if (!formData.country) validationErrors.country = "Country is required";
    if (!formData.zip_code) validationErrors.zip_code = "ZIP Code is required";
    if (!formData.age) validationErrors.age = "Age is required";
    if (!formData.height) validationErrors.height = "Height is required";
    if (!formData.burst) validationErrors.burst = "Burst size is required";
    

    if (Object.keys(validationErrors).length > 0) {
      toast.error("All fields are required. Please fill out the missing information.");
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    const interestsString = JSON.stringify(selectedInterests);
    formDataToSend.append("user_interests", interestsString);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("confirmPassword", formData.confirmPassword);
    formDataToSend.append("phone_code", formData.phone_code);
    formDataToSend.append("phone_number", formData.phone_number);
    formDataToSend.append("phone_country_code", formData.phone_country_code);
    formDataToSend.append("zip_code", formData.zip_code);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("latitude", formData.latitude);
    formDataToSend.append("longitude", formData.longitude);
    formDataToSend.append("age", formData.age);
    formDataToSend.append("height", formData.height);
    formDataToSend.append("weight", formData.weight);
    formDataToSend.append("burst", formData.burst);
    formDataToSend.append("about", formData.about);
    formDataToSend.append("eye_color", formData.eye_color);
    formDataToSend.append("hair_color", formData.hair_color);
    formDataToSend.append("sex", formData.sex);
    formDataToSend.append("is_user", formData.is_user);

    if (formData.main_image) {
      formDataToSend.append("main_image", formData.main_image);
    } else {
      formDataToSend.append("main_image", "");
    }

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });
    } else {
      formDataToSend.append("images", "");
    }
    if (formData.videos && formData.videos.length > 0) {
      formData.videos.forEach((video, index) => {
        formDataToSend.append(`videos[${index}]`, video);
      });
    } else {
      formDataToSend.append("videos", "");
    }

    try {
    let {data}=  await apis.register(formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("userId",data.data.id)
      navigate(`/otpscreen/${formData.email}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again later.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div className="container mx-auto">
        <div className="about-us-img">
          <div>
            <h1 style={{ fontFamily: "Recoleta-Regular", fontSize: "40px" }}>
              Become Our Advert
            </h1>
            <p style={{ fontFamily: "Recoleta-Regular" }}>
              Home/ <span style={{ color: "red" }}>Form</span>
            </p>
          </div>
        </div>

        <div className="heading">
          <h1 style={{ fontFamily: "Recoleta-Regular", marginTop: "3vw" }}>
            Registration Form
          </h1>
        </div>

        <form onSubmit={register}>
          <div className="inputs">
            <div className="first-sec">
              {/* <Flowerright /> */}
              <input
                type="text"
                name="name"
                style={{ border: errors.name ? "1px solid red" : "" }}
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="input input-bordered input-primary"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}

              <input
                type="email"
                name="email"
                style={{ border: errors.email ? "1px solid red" : "" }}
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="input input-bordered input-primary"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}

              <input
                type="number"
                name="phone_number"
                style={{ border: errors.phone_number ? "1px solid red" : "" }}
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
                className="input input-bordered input-primary"
              />
              {errors.phone_number && (
                <p className="error-text">{errors.phone_number}</p>
              )}
              <input
                type="text"
                name="zip_code"
                id="zip_code_input" // Add ID for easier access
                style={{ border: errors.zip_code ? "1px solid red" : "" }}
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="ZIP Code"
                className="input input-bordered input-primary"
              />
              {errors.zip_code && (
                <p className="error-text">{errors.zip_code}</p>
              )}

              <input
                type="text"
                name="address"
                style={{
                  border: errors.address ? "1px solid red" : "",
                  // display: "none",
                }}
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="input input-bordered input-primary"
              />
              
              {errors.address && <p className="error-text">{errors.address}</p>}

              {/* Autofilled Fields */}
              <input
                type="text"
                name="city"
                style={{ border: errors.city ? "1px solid red" : "" }}
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                // disabled
                className="input input-bordered input-primary"
              />
              {errors.city && <p className="error-text">{errors.city}</p>}

              <input
                type="text"
                name="state"
                style={{
                  border: errors.state ? "1px solid red" : "",
                  display: "none",
                }}
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                // disabled
                className="input input-bordered input-primary"
              />

              {/*{errors.state && <p className="error-text">{errors.state}</p>} */}

              <input
                type="text"
                name="country"
                style={{ border: errors.country ? "1px solid red" : "" }}
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="input input-bordered input-primary"
                // disabled
              />

              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                style={{ display: "none" }}
                placeholder="Latitude"
                className="input input-bordered input-primary"
              />

              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                style={{ display: "none" }}
                placeholder="Longitude"
                className="input input-bordered input-primary"
              />
              <input
                type="text"
                name="age"
                value={formData.age}
                style={{ border: errors.age ? "1px solid red" : "" }}
                onChange={handleChange}
                placeholder="Your Age"
                className="input input-bordered input-primary"
              />
              {errors.age && <p className="error-text">{errors.age}</p>}

              <input
                type="text"
                name="hair_color"
                style={{ border: errors.hair_color ? "1px solid red" : "" }}
                value={formData.hair_color}
                onChange={handleChange}
                placeholder="Enter Hair Color"
                className="input input-bordered input-primary"
              />
              {errors.hair_color && (
                <p className="error-text">{errors.hair_color}</p>
              )}
            </div>

            <div className="first-sec">
              {/* <input
                type="text"
                name="zip_code"
                style={{ border: errors.zip_code ? "1px solid red" : "" }}
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="ZIP Code"
                className="input input-bordered input-primary"
              />
              {errors.zip_code && (
                <p className="error-text">{errors.zip_code}</p>
              )} */}

              <input
                type="text"
                name="height"
                style={{ border: errors.height ? "1px solid red" : "" }}
                value={formData.height}
                onChange={handleChange}
                placeholder="Your Height (CM)"
                className="input input-bordered input-primary"
              />
              {errors.height && <p className="error-text">{errors.height}</p>}

              <input
                type="text"
                name="burst"
                value={formData.burst}
                style={{ border: errors.burst ? "1px solid red" : "" }}
                onChange={handleChange}
                placeholder="Burst Size"
                className="input input-bordered input-primary"
              />
              {errors.burst && <p className="error-text">{errors.burst}</p>}
              {/* Sex Dropdown */}
              {/* <select
                name="sex"
                value={formData.sex}
                style={{ border: errors.sex ? "1px solid red" : "" }}
                onChange={handleChange}
                className="input input-bordered input-primary"
              >
                <option value="">Select Sex</option>
                <option value="man">Man</option>
                <option value="woman">Woman</option>
              </select>
              {errors.sex && <p className="error-text">{errors.sex}</p>} */}

              {/* City Autocomplete */}

              <input
                type="text"
                name="eye_color"
                style={{ border: errors.eye_color ? "1px solid red" : "" }}
                value={formData.eye_color}
                onChange={handleChange}
                placeholder="Eye Color"
                className="input input-bordered input-primary"
              />
              {errors.eye_color && (
                <p className="error-text">{errors.eye_color}</p>
              )}

              <input
                type="text"
                name="weight"
                style={{ border: errors.weight ? "1px solid red" : "" }}
                value={formData.weight}
                onChange={handleChange}
                placeholder="Your Weight (IB)"
                className="input input-bordered input-primary"
              />
              {errors.weight && <p className="error-text">{errors.weight}</p>}
              <div className="relative">
      <input
        type={passwordVisible ? "text" : "password"} // Toggle input type
        name="password"
        style={{ border: errors.password ? "1px solid red" : "" }}
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter Password"
        className="input input-bordered input-primary"
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        aria-label="Toggle password visibility"
      >
        {passwordVisible ? <FaEyeSlash /> : <FaEye />} 
      </button>
      {errors.password && <p className="error-text">{errors.password}</p>}
    </div>
              <input
                type="password"
                name="confirmPassword"
                style={{
                  border: errors.confirmPassword ? "1px solid red" : "",
                }}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter Confirm Password"
                className="input input-bordered input-primary"
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="inputs">
            <div className="second-sec">
              <textarea
                name="about"
                style={{ border: errors.about ? "1px solid red" : "" }}
                value={formData.about}
                onChange={handleChange}
                placeholder="About Me"
                className="about-me-textarea"
              ></textarea>
              {errors.about && <p className="error-text">{errors.about}</p>}
            </div>
          </div>

          <div className="field-container">
            <h1 style={{ fontFamily: "Recoleta-Regular" }}>Field Interest</h1>
            <div className="checkbox-container">
              <div className="checkbox-group">
                <div className="checkbox-group">
                  {interest.map((int, index) => (
                    <label key={index}>
                      <input
                        type="checkbox"
                        onChange={(e) => handleInterestChange(e, int.id)}
                      />
                      {int.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Image Upload Section */}
          <div className="upload-container">
            <h1 style={{ fontFamily: "Recoleta-Regular" }}>
              Main Image Upload
            </h1>
            <label className="upload-label" htmlFor="mainImage">
              <div className="upload-area">
                <p>Upload Main Image</p>
              </div>
              <input
                id="mainImage"
                className="upload-input"
                name="mainImage"
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                style={{ display: "none" }}
              />
            </label>
            <p className="hd-quality-instruction">
              Please upload an HD-quality image .
            </p>
            <div className="uploaded-images">
              <div className="uploaded-image-container">
                {mainImage && (
                  <img
                    src={mainImage}
                    alt="Main Upload"
                    className="uploaded-image"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Multiple Images Upload Section */}
          <div className="upload-container">
            <h1 style={{ fontFamily: "Recoleta-Regular" }}>UPLOAD SHOTS</h1>
            <div className=" upload-header">
              <label className="upload-label" htmlFor="uploadimages">
                <div className="upload-area">
                  <p style={{ fontFamily: "Recoleta-Regular" }}>
                    Drag & Drop To Upload
                    <br />
                    Or Browse
                  </p>
                </div>
                <input
                  id="uploadimages"
                  className="upload-input"
                  name="uploadimages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <p className="hd-quality-instruction">
              Please upload an HD-quality image .
            </p>
            <div className="uploaded-images">
              {images.map((image, index) => (
                <div key={index} className="uploaded-image-container">
                  <img
                    src={image}
                    alt={`Uploaded ${index}`}
                    className="uploaded-image"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Multiple videos Upload Section */}
          <div className="upload-container">
            <h1>Video Upload (30 seconds max)</h1>
            <label className="upload-label" htmlFor="videos">
              <div className="upload-area">
                <p>Upload Videos</p>
              </div>
              <input
                id="videos"
                className="upload-input"
                name="videos"
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                style={{ display: "none" }}
              />
            </label>
            <div className="uploaded-videos">
              {videos.map((video, index) => (
                <div key={index} className="video-preview-container">
                  <video
                    src={URL.createObjectURL(video)}
                    controls
                    width="200"
                  ></video>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="submit-button">
            <button type="submit" className=" " disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {/* {apiError && <p className="error-message">{apiError}</p>} */}
        </form>

        <Footer />
      </div>
    </>
  );
};

export default RegistrationForm;
