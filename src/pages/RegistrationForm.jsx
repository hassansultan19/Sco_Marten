import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Assuming you're using React Router
import Flower from "../components/Flower";
import Flowerright from "../components/Flowerright";
import Footer from "../components/Footer";
import "../pages/Registration.css";
import apis from "../Service/Index";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocationStore } from "../store/useLocationStore";
import { useLanguage } from "../LanguageContext";

const RegistrationForm = () => {
  const navigate = useNavigate(); // For redirection after registration
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null); // State for main image
  const [videos, setVideos] = useState([]);
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

  useEffect(() => {
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressRef.current,
        { types: ["address"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const addressComponents = place.address_components;

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

    const handleZipChange = async (zipCode) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=dk-${zipCode}&key=AIzaSyDg6Ci3L6yS5YvtKAkWQjnodGUtlNYHw9Y&libraries=places`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const addressComponents = data.results[0].address_components;
          const formattedAddress = data.results[0].formatted_address;
          const location = data.results[0].geometry.location;
          let latitude = location.lat;
          let longitude = location.lng;
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
            address: address.trim(),
            latitude,
            longitude,
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            city: "",
            state: "",
            country: "",
            address: "",
            latitude: null,
            longitude: null,
          }));
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    const zipCodeInput = document.getElementById("zip_code_input");
    if (zipCodeInput) {
      zipCodeInput.addEventListener("change", (event) => {
        handleZipChange(event.target.value);
      });
    }

    return () => {
      if (zipCodeInput) {
        zipCodeInput.removeEventListener("change", handleZipChange);
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => prevImages.concat(imageUrls));
    setFormData({
      ...formData,
      images: files,
    });
  };

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

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  const [interest, setInterest] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `
https://escortnights.dk/backend-martin/public/api/auth/interests`
        );

        if (response.data && Array.isArray(response.data.data.interests)) {
          setInterest(response.data.data.interests);
        } else {
          console.error("Unexpected data format:", response.data);
        }
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

    let validationErrors = {};

    if (!formData.country) return toast.error("Zip code field is not valid.");
    if (!formData.name) validationErrors.name = "Name is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.password) validationErrors.password = "Password is required";
    if (!formData.confirmPassword)
      validationErrors.confirmPassword = "Confirm Password is required";
    if (!formData.phone_number)
      validationErrors.phone_number = "Phone Number is required";
    if (!formData.hair_color)
      validationErrors.hair_color = "Hair Color is required";
    if (!formData.zip_code) validationErrors.zip_code = "ZIP Code is required";
    if (!formData.age) validationErrors.age = "Age is required";
    if (!formData.height) validationErrors.height = "Height is required";
    if (!formData.burst) validationErrors.burst = "Burst size is required";
    // if (!videos?.length) validationErrors.videos = "Video is required";
    if (!images?.length) validationErrors.images = "Image is required";
    if (!mainImage) validationErrors.mainImage = "Main Image is required";

    if (Object.keys(validationErrors).length > 0) {
      toast.error(
        "All fields are required. Please fill out the missing information."
      );
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

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
      let { data } = await apis.register(formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("userId", data.data.id);
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
  const { language } = useLanguage();

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
              {language === "en" ? "Create advert" : "Opret annonce"}
            </h1>
            <p style={{ fontFamily: "Recoleta-Regular" }}>
              Home/ <span style={{ color: "red" }}>Form</span>
            </p>
          </div>
        </div>

        <div className="heading">
          <h1 style={{ fontFamily: "Recoleta-Regular", marginTop: "3vw" }}>
            {language === "en"
              ? " Registration Form"
              : "Tilmeldings  Form                                                                            "}
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
                placeholder={language === "en" ? "Your Name" : "Navn"}
                className="input input-bordered input-primary"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}

              <input
                type="email"
                name="email"
                style={{ border: errors.email ? "1px solid red" : "" }}
                value={formData.email}
                onChange={handleChange}
                placeholder={language === "en" ? "Email" : "E-mail"}
                className="input input-bordered input-primary"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}

              <input
                type="number"
                name="phone_number"
                style={{ border: errors.phone_number ? "1px solid red" : "" }}
                value={formData.phone_number}
                onChange={handleChange}
                placeholder={language === "en" ? "Phone" : "Telefonnummer"}
                className="input input-bordered input-primary"
              />
              {errors.phone_number && (
                <p className="error-text">{errors.phone_number}</p>
              )}
              <input
                type="text"
                name="zip_code"
                id="zip_code_input"
                style={{ border: errors.zip_code ? "1px solid red" : "" }}
                value={formData.zip_code}
                onChange={handleChange}
                placeholder={language === "en" ? "ZIP Code" : "postnummer"}
                className="input input-bordered input-primary"
              />
              {errors.zip_code && (
                <p className="error-text">{errors.zip_code}</p>
              )}

              <input
                type="text"
                name="address"
                disabled={true}
                style={{
                  border: errors.address ? "1px solid red" : "",
                }}
                value={formData.address}
                onChange={handleChange}
                placeholder={language === "en" ? "Address" : "Adresse"}
                className="input input-bordered input-primary text-slate-300"
              />

              {errors.address && <p className="error-text">{errors.address}</p>}

              {/* Autofilled Fields */}
              <input
                type="text"
                name="city"
                disabled={true}
                style={{ border: errors.city ? "1px solid red" : "" }}
                value={formData.city}
                onChange={handleChange}
                placeholder={language === "en" ? "City" : "By"}
                // disabled
                className="input input-bordered input-primary text-slate-300"
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
                placeholder={language === "en" ? "State" : "Tilstand"}
                // disabled
                className="input input-bordered input-primary "
              />

              {/*{errors.state && <p className="error-text">{errors.state}</p>} */}

              <input
                type="text"
                name="country"
                disabled={true}
                style={{ border: errors.country ? "1px solid red" : "" }}
                value={formData.country}
                onChange={handleChange}
                placeholder={language === "en" ? "Country" : "Land"}
                className="input input-bordered input-primary"
                // disabled
              />

              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                style={{ display: "none" }}
                placeholder={language === "en" ? "Latitude" : "Breddegrad"}
                className="input input-bordered input-primary"
              />

              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                style={{ display: "none" }}
                placeholder={language === "en" ? "Longitude" : "Længde"}
                className="input input-bordered input-primary"
              />
              <input
                type="text"
                name="age"
                value={formData.age}
                style={{ border: errors.age ? "1px solid red" : "" }}
                onChange={handleChange}
                placeholder={language === "en" ? "Your Age" : "Alder"}
                className="input input-bordered input-primary"
              />
              {errors.age && <p className="error-text">{errors.age}</p>}

              <input
                type="text"
                name="hair_color"
                style={{ border: errors.hair_color ? "1px solid red" : "" }}
                value={formData.hair_color}
                onChange={handleChange}
                placeholder={
                  language === "en" ? "Enter Hair Color" : " hårfarve"
                }
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
                placeholder={
                  language === "en" ? " Your Height (CM)" : "højde (CM)"
                }
                className="input input-bordered input-primary"
              />
              {errors.height && <p className="error-text">{errors.height}</p>}

              <input
                type="text"
                name="burst"
                value={formData.burst}
                style={{ border: errors.burst ? "1px solid red" : "" }}
                onChange={handleChange}
                placeholder={language === "en" ? "Burst Size" : "Bryst Size"}
                className="input input-bordered input-primary"
              />
              {errors.burst && <p className="error-text">{errors.burst}</p>}

              <input
                type="text"
                name="eye_color"
                style={{ border: errors.eye_color ? "1px solid red" : "" }}
                value={formData.eye_color}
                onChange={handleChange}
                placeholder={language === "en" ? "Eye Color" : "Øjenfarve"}
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
                placeholder={
                  language === "en" ? "Your Weight (KG)" : "vægt (KG)"
                }
                className="input input-bordered input-primary"
              />
              {errors.weight && <p className="error-text">{errors.weight}</p>}
              <div
                className="flex items-center input bg-[#292929] input-bordered input-primary p-0 pr-4"
                style={{ border: errors.password ? "1px solid red" : "" }}
              >
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    language === "en" ? "Enter Password" : " adgangskode"
                  }
                  className=""
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className=" flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
              <input
                name="confirmPassword"
                type={passwordVisible ? "text" : "password"}
                style={{
                  border: errors.confirmPassword ? "1px solid red" : "",
                }}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={
                  language === "en"
                    ? "Enter Confirm Password"
                    : " Bekræft adgangskode"
                }
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
                placeholder={language === "en" ? "About Me" : "Om mig"}
                className="about-me-textarea"
              ></textarea>
              {errors.about && <p className="error-text">{errors.about}</p>}
            </div>
          </div>

          <div className="field-container">
            <h1 style={{ fontFamily: "Recoleta-Regular" }}>
              {language === "en" ? "Field Interest" : "Feltinteresse"}
            </h1>
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
              {language === "en"
                ? "Upload Main Image"
                : "Upload Profile Billede"}
            </h1>
            <label className="upload-label" htmlFor="mainImage">
              <div className="upload-area">
                <p>
                  {" "}
                  {language === "en"
                    ? "Upload Main Image"
                    : "Upload Profile Billede"}
                </p>
              </div>
              <input
                id="mainImage"
                className="upload-input"
                style={{
                  border: errors.mainImage ? "1px solid red" : "",
                  display: "none",
                }}
                name="mainImage"
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
              />
              {errors.mainImage && (
                <p className="error-text">{errors.mainImage}</p>
              )}
            </label>
            <p className="hd-quality-instruction">
              {language === "en"
                ? "Please upload an HD-quality image ."
                : "Upload venligst et billede i HD-kvalitet."}
            </p>
            <div className="uploaded-images">
              <div className="uploaded-image-container">
                {mainImage && (
                  <>
                    <img
                      src={mainImage}
                      alt="Main Upload"
                      className="uploaded-image"
                    />
                    <button
                      onClick={() => setMainImage(null)}
                      className="remove-button mt-1"
                    >
                      {language === "en" ? "   Remove" : "Fjern"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="upload-container">
            <h1 style={{ fontFamily: "Recoleta-Regular" }}>
              {language === "en" ? "UPLOAD IMAGES SHOTS" : "UPLOAD BILLEDER"}
            </h1>
            <div className=" upload-header">
              <label className="upload-label" htmlFor="uploadimages">
                <div className="upload-area">
                  <p style={{ fontFamily: "Recoleta-Regular" }}>
                    {language === "en"
                      ? "UPLOAD IMAGES SHOTS"
                      : "UPLOAD BILLEDER"}
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
                  style={{
                    border: errors.images ? "1px solid red" : "",
                    display: "none",
                  }}
                />
                {errors.images && <p className="error-text">{errors.images}</p>}
              </label>
            </div>
            <p className="hd-quality-instruction">
              {language === "en"
                ? "Please upload an HD-quality image ."
                : "Upload venligst et billede i HD-kvalitet."}
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
                    className="remove-button mt-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="upload-container">
            <h1>
              {language === "en"
                ? "Upload Videos  (30 seconds max)"
                : "Upload Videoer (maks. 30 sekunder)"}
            </h1>
            <label className="upload-label" htmlFor="videos">
              <div className="upload-area">
                <p>{language === "en" ? "Upload Videos" : "Upload Videoer"}</p>
              </div>
              <input
                id="videos"
                className="upload-input"
                name="videos"
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                style={{
                  border: errors.videos ? "1px solid red" : "",
                  display: "none",
                }}
              />
              {errors.videos && <p className="error-text">{errors.videos}</p>}
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
                    className="mt-1"
                    onClick={() => handleRemoveVideo(index)}
                  >
                    {language === "en" ? "   Remove" : "Fjern"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="submit-button">
            <button type="submit" className=" " disabled={loading}>
              {language === "en"
                ? loading
                  ? "Submitting..."
                  : "Submit"
                : loading
                ? "Indsend..."
                : "Indsend"}
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
