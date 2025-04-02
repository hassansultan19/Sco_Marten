"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Flowerright from "../components/Flowerright";
import Footer from "../components/Footer";
import "../pages/Registration.css";
import Swal from "sweetalert2";
import { useUser } from "../store/useUser";
import { useLanguage } from "../LanguageContext";

const UpdateProfile = () => {
  const [packages, setPackages] = useState([]);
  const [userData, setUserData] = useState({});
  const [allInterests, setAllInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [mainImage, setMainImage] = useState(null); // Store the URL/path for main image
  const [mainImageFile, setMainImageFile] = useState(null); // Store the File object for main image
  const [isMainImageChanged, setIsMainImageChanged] = useState(false); // Track if main image was changed
  const [mediaImages, setMediaImages] = useState([]); // Store File objects for media images
  const [mediaVideos, setMediaVideos] = useState([]); // Store File objects for media images
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [deletedVideosFiles, setDeletedVideoFiles] = useState([]);
  const addressInputRef = useRef(null);
  const [showDays, setShowDays] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]); // Actual files
  const [mediaVideosFiles, setMediaVideosFiles] = useState([]); // Actual files
  const [loading, setLoading] = useState(false);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://escortnights.dk/backend-martin/public/api/admin/packages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPackages(response.data.data.packages);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      Swal.fire({
        title: "Not Logged In",
        text: "Please log in to update your profile.",
        icon: "warning",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then(() => {
        window.location.href = "/login";
      });
      return;
    }

    const fetchInterests = async () => {
      try {
        const response = await axios.get(
          "https://escortnights.dk/backend-martin/public/api/auth/interests"
        );
        if (response.data && Array.isArray(response.data.data.interests)) {
          setAllInterests(response.data.data.interests);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };
    fetchInterests();
  }, []);
  const [mediaImageIds, setMediaImageIds] = useState([]);

  useEffect(() => {
    const guid = localStorage.getItem("userId");
    if (guid) {
      axios
        .get(
          `
https://escortnights.dk/backend-martin/public/api/escort/get-user-id/${guid}`
        )
        .then((response) => {
          const escortData = response?.data?.data?.user;
          console.log("escortData", escortData);
          setUserData(escortData);

          // Reset the change tracker when loading initial data
          setIsMainImageChanged(false);
          setMainImageFile(escortData?.main_image);
          setMainImage(escortData?.main_image);

          let imagesArray = [];
          try {
            if (typeof escortData?.images === "string") {
              imagesArray = JSON.parse(escortData?.images);
            } else if (Array.isArray(escortData?.images)) {
              imagesArray = escortData?.images;
            }
          } catch (e) {
            console.error("Error parsing images:", e);
          }

          setMediaImages(imagesArray);
          setMediaImageIds(imagesArray?.map((_, index) => index));

          let videosArray = [];
          try {
            if (typeof escortData?.videos === "string") {
              videosArray = JSON.parse(escortData?.videos);
            } else if (Array.isArray(escortData?.videos)) {
              videosArray = escortData?.videos;
            }
          } catch (e) {
            console.error("Error parsing videos:", e);
          }

          setMediaVideos(videosArray);

          const userInterests = escortData?.user_interest?.map(
            (item) => item.interest_id
          );
          setSelectedInterests(userInterests);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps script not loaded");
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        types: ["(regions)"],
        componentRestrictions: { country: ["us"] },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place) {
        const addressComponents = place.address_components;
        const addressData = {
          address: place.formatted_address,
          city: "",
          state: "",
          country: "",
          zip_code: "",
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        };

        addressComponents.forEach((component) => {
          const types = component.types;
          if (types.includes("locality")) {
            addressData.city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            addressData.state = component.long_name;
          } else if (types.includes("country")) {
            addressData.country = component.long_name;
          } else if (types.includes("postal_code")) {
            addressData.zip_code = component.long_name;
          }
        });

        setUserData((prev) => ({
          ...prev,
          ...addressData,
        }));
      }
    });
  }, []);
  console.log("mainImage", mainImage);
  const { language } = useLanguage();
  const handleInterestChange = (interestId) => {
    setSelectedInterests((prevSelected) =>
      prevSelected.includes(interestId)
        ? prevSelected.filter((id) => id !== interestId)
        : [...prevSelected, interestId]
    );
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImage(reader.result);
        setMainImageFile(file);
        setIsMainImageChanged(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  const handleRemoveMainImage = () => {
    setMainImage(null);
    setMainImageFile(null);
    setIsMainImageChanged(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newMediaFiles = [...mediaFiles];
    const newMediaImages = [...mediaImages];
    const newMediaImageIds = [...mediaImageIds];

    files.forEach((file) => {
      const preview = URL.createObjectURL(file);
      newMediaFiles.push(file);
      newMediaImages.push(preview);
      newMediaImageIds.push(
        `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      );
    });

    setMediaFiles(newMediaFiles);
    setMediaImages(newMediaImages);
    setMediaImageIds(newMediaImageIds);

    // Reset the input value to allow selecting the same file again
    e.target.value = null;
  };

  const handleVideosFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create new preview URLs for the files and add them to state
    const newMediaVideosFiles = [...mediaVideosFiles];
    const newMediaVideos = [...mediaVideos];

    files.forEach((file) => {
      const preview = URL.createObjectURL(file);
      newMediaVideosFiles.push(file);
      newMediaVideos.push(preview);
    });

    setMediaVideosFiles(newMediaVideosFiles);
    setMediaVideos(newMediaVideos);

    // Reset the input value to allow selecting the same file again
    e.target.value = null;
  };

  const handleRemoveImage = (index) => {
    // Store the actual image ID or URL for deletion on the server
    if (mediaImages[index]) {
      // If it's an existing image from the server (not a newly added one)
      if (
        typeof mediaImages[index] === "string" &&
        !mediaImages[index].startsWith("blob:")
      ) {
        setDeletedFiles((prev) => [...prev, mediaImageIds[index]]);
      }
    }

    // Remove from preview array
    setMediaImages((prev) => prev.filter((_, i) => i !== index));

    // Remove from files array if it's a new file
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));

    // Remove from IDs array
    setMediaImageIds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index) => {
    // Store the actual video URL for deletion on the server
    if (mediaVideos[index]) {
      // If it's an existing video from the server (not a newly added one)
      if (
        typeof mediaVideos[index] === "string" &&
        !mediaVideos[index].startsWith("blob:")
      ) {
        setDeletedVideoFiles((prev) => [...prev, index]);
      }
    }

    // Remove from preview array
    setMediaVideos((prev) => prev.filter((_, i) => i !== index));

    // Remove from files array if it's a new file
    setMediaVideosFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const [loader, setLoader] = useState(false);

  // Update the handleUpdateProfile function with better main image handling
  const handleUpdateProfile = async () => {
    setLoader(true);
    const token = localStorage.getItem("authToken");
    if (!token) return alert("Please log in to update your profile");

    const formData = new FormData();
    formData.append("about", userData.about || "");
    formData.append("name", userData.name || "");
    formData.append("phone_code", userData.phone_code || "+92");
    formData.append("phone_number", userData.phone_number || "");
    formData.append("age", userData.age || "");
    formData.append("eye_color", userData.eye_color || "");
    formData.append("height", userData.height || "");
    formData.append("weight", userData.weight || "");
    formData.append("burst", userData.burst || "");
    formData.append("address", userData.address || "");
    formData.append("sex", userData.sex || "");
    formData.append("hair_color", userData.hair_color || "");

    // Improved main image handling for API submission
    if (isMainImageChanged) {
      if (mainImageFile instanceof File) {
        // If a new file was uploaded
        formData.append("main_image", mainImageFile);
      } else if (mainImage) {
        // If using an existing image from the server
        try {
          const response = await fetch(mainImage);
          const blob = await response.blob();
          formData.append("main_image", blob, "main_image.jpg");
        } catch (error) {
          console.error("Failed to fetch existing main image:", error);
        }
      } else {
        // If main image was removed
        formData.append("main_image_removed", "true");
      }
    } else if (mainImage) {
      // If main image wasn't changed but exists
      formData.append("main_image_unchanged", "true");
    }

    // For existing images that weren't deleted
    const existingImages = mediaImages.filter(
      (img, index) =>
        typeof img === "string" &&
        !img.startsWith("blob:") &&
        !deletedFiles.includes(mediaImageIds[index])
    );

    // Append existing images data
    if (existingImages.length > 0) {
      formData.append("existing_images", JSON.stringify(existingImages));
    }

    // Append new media files
    mediaFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    // For existing videos that weren't deleted
    const existingVideos = mediaVideos.filter(
      (vid, index) =>
        typeof vid === "string" &&
        !vid.startsWith("blob:") &&
        !deletedVideosFiles.includes(index)
    );

    // Append existing videos data
    if (existingVideos.length > 0) {
      formData.append("existing_videos", JSON.stringify(existingVideos));
    }

    // Append new video files
    mediaVideosFiles.forEach((file, index) => {
      formData.append(`videos[${index}]`, file);
    });
    formData.append("user_interests", JSON.stringify(selectedInterests));
    formData.append("deleted_files", JSON.stringify(deletedFiles));
    formData.append("deleted_video_files", JSON.stringify(deletedVideosFiles));

    try {
      const response = await axios.post(
        "https://escortnights.dk/backend-martin/public/api/escort/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Profile Updated!",
        text: "Your profile has been successfully updated.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          content: "swal-content",
          confirmButton: "swal-confirm-button",
        },
      }).then(() => {
        // Reset the change tracker after successful update
        setIsMainImageChanged(false);
      });
    } catch (error) {
      Swal.fire({
        title: "Update Failed",
        text: "Some fields are required but are missing.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          content: "swal-content",
          confirmButton: "swal-confirm-button",
        },
      });
    } finally {
      setLoader(false);
    }

    if (showDays === true) {
      try {
        const response = await axios.post(
          "https://escortnights.dk/backend-martin/public/api/escort/update-featured",
          { days: selectedDay }, // Payload for the API
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Days updated successfully:", response.data);
        alert("Days updated successfully!");
      } catch (error) {
        console.error("Error updating days:", error.response?.data || error);
        alert("Failed to update days. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      null;
    }
  };
  const { userPackages } = useUser();
  console.log("mainImage", mainImage);
  return (
    <>
      <div className="container mx-auto">
        <div className="heading">
          <h1
            className="flex gap-x-10 items-center "
            style={{ fontFamily: "Recoleta-Regular", marginTop: "3vw" }}
          >
            Update Profile{" "}
            {userPackages.id ? (
              <div className="w-32 text-center bg-yellow-500 text-black text-xs font-bold py-1 px-3 rounded-full">
                FEATURED
              </div>
            ) : (
              ""
            )}
          </h1>
        </div>

        <div className="inputs">
          <div className="first-sec">
            <Flowerright />
            <label htmlFor="name">
              {language === "en" ? "Your Name" : "Navn"}
            </label>
            <input
              type="text"
              name="name"
              value={userData.name || ""}
              placeholder={language === "en" ? "Your Name" : "Navn"}
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
            <label htmlFor="email">
              {language === "en" ? "Email" : "E-mail"}
            </label>
            <input
              type="email"
              name="email"
              value={userData.email || ""}
              placeholder={language === "en" ? "Email" : "E-mail"}
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />

            <label htmlFor="phone_number">
              {language === "en" ? "Phone Number" : "Telefonnummer"}{" "}
            </label>
            <input
              type="number"
              name="phone_number"
              disabled={true}
              value={userData.phone_number || ""}
              placeholder={language === "en" ? "Phone Number" : "Telefonnummer"}
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, phone_number: e.target.value })
              }
            />

            <label htmlFor="zip_code">
              {language === "en" ? " Zip Code" : "Postnummer"}
            </label>
            <input
              type="text"
              name="zip_code"
              disabled={true}
              ref={addressInputRef}
              value={userData.zip_code || ""}
              placeholder="ZIP Code"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, zip_code: e.target.value })
              }
            />
            <input
              type="text"
              name="address"
              // ref={addressInputRef} // Attach ref here
              value={userData.address || ""}
              placeholder="Location"
              className="input input-bordered input-primary hidden"
              onChange={(e) =>
                setUserData({ ...userData, address: e.target.value })
              }
            />

            <label htmlFor="city">{language === "en" ? "City" : "By"}</label>
            {/* Autofilled Fields */}
            <input
              type="text"
              disabled={true}
              name="city"
              value={userData.city || ""}
              placeholder={language === "en" ? "City" : "By"}
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, city: e.target.value })
              }
            />

            <input
              type="text"
              name="state"
              value={userData.state || ""}
              placeholder="State"
              className="input input-bordered input-primary hidden"
              onChange={(e) =>
                setUserData({ ...userData, state: e.target.value })
              }
            />

            <label htmlFor="Country">Country</label>
            <input
              type="text"
              name="country"
              value={userData.country || ""}
              placeholder="Country"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, country: e.target.value })
              }
            />

            <input
              type="text"
              name="latitude"
              value={userData.latitude || ""}
              style={{ display: "none" }}
              placeholder="Latitude"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, latitude: e.target.value })
              }
            />

            <input
              type="text"
              name="longitude"
              value={userData.longitude || ""}
              style={{ display: "none" }}
              placeholder="Longitude"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, longitude: e.target.value })
              }
            />
            <label htmlFor="hair_color">
              {language === "en" ? " Hair Color" : " Hårfarve"}
            </label>
            <input
              type="text"
              name="hair_color"
              value={userData.hair_color || ""}
              placeholder={language === "en" ? " Hair Color" : " Hårfarve"}
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, hair_color: e.target.value })
              }
            />
          </div>

          <div className="second-sec">
            <label htmlFor="age">{language === "en" ? "Age" : "Alder"}</label>
            <input
              type="text"
              name="age"
              value={userData.age || ""}
              placeholder={language === "en" ? "Your Age" : "Alder"}
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, age: e.target.value })
              }
            />
            <label htmlFor="height">
              {language === "en" ? "  Height " : "Højde "}
            </label>
            <input
              type="text"
              name="height"
              value={userData.height || ""}
              placeholder={
                language === "en" ? " Your Height (CM)" : "Højde (CM)"
              }
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, height: e.target.value })
              }
            />
            <label htmlFor="weight">
              {language === "en" ? "Burst Size" : "Bryst Størrelse"}
            </label>
            <input
              type="text"
              name="burst"
              value={userData.burst || ""}
              placeholder={language === "en" ? "Burst Size" : "Bryst Størrelse"}
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, burst: e.target.value })
              }
            />
            {/* Sex Dropdown */}
            <label htmlFor="sex">Sex</label>
            <select
              name="sex"
              value={userData.sex || ""}
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, sex: e.target.value })
              }
            >
              <option value="">
                {language === "en" ? "Select Sex" : "Vælg Køn"}
              </option>
              <option value="Woman">
                {language === "en" ? "Woman" : "Kvinde"}
              </option>
              <option value="Man">{language === "en" ? "Man" : "Mand"}</option>
              <option value="Trans">
                {language === "en" ? "Trans" : "Trans"}
              </option>
            </select>

            {/* City Autocomplete */}
            <label htmlFor="eye_color">
              {language === "en" ? "Eye Color" : "Øjenfarve"}
            </label>
            <input
              type="text"
              name="eye_color"
              value={userData.eye_color || ""}
              placeholder={language === "en" ? "Eye Color" : "Øjenfarve"}
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, eye_color: e.target.value })
              }
            />
            <label htmlFor="weight">
              {language === "en" ? "Weight" : "vægt"}
            </label>
            <input
              type="text"
              name="weight"
              value={userData.weight || ""}
              placeholder={language === "en" ? "Your Weight (KG)" : "vægt (KG)"}
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, weight: e.target.value })
              }
            />
          </div>
        </div>
        <div className="inputs">
          <div className="second-sec">
            <label htmlFor="about">{language === "en" ? "About" : "Om"}</label>
            <textarea
              name="about"
              value={userData.about || ""}
              placeholder={language === "en" ? "About Me" : "Om mig"}
              className="about-me-textarea"
              onChange={(e) =>
                setUserData({ ...userData, about: e.target.value })
              }
            ></textarea>
          </div>
        </div>
        <div className="field-container">
          <h1 style={{ fontFamily: "Recoleta-Regular" }}>
            {" "}
            {language === "en" ? "Field Interest" : "Feltinteresse"}
          </h1>
          <div className="checkbox-container">
            <div className="checkbox-group">
              <div className="checkbox-group">
                {allInterests?.map((interest) => (
                  <label key={interest.id}>
                    <input
                      type="checkbox"
                      checked={selectedInterests.includes(interest.id)}
                      onChange={() => handleInterestChange(interest.id)}
                    />
                    {interest.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="field-container">
          <h1 style={{ fontFamily: "Recoleta-Regular" }}>Profile Status</h1>
          <div className="checkbox-container">
            <div className="checkbox-group">
              <label>
                <input type="checkbox" onChange={handleCheckboxChange} />
                Feature Your Profile
              </label>
            </div>
          </div>
        </div> */}
        {showDays && (
          <div className="field-container">
            <div className="checkbox-container">
              {packages?.map((day, index) => (
                <span
                  key={index}
                  className={selectedDay === day.id ? "active-day" : ""}
                  onClick={() => handleDayClick(day.duration)}
                  style={{
                    cursor: "pointer",
                    padding: "5px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                >
                  {day.duration} Days <br />
                  {day.price} Price
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="upload-container">
          <h1>
            {" "}
            {language === "en" ? "Upload Main Image" : "Upload Profile Billede"}
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
              name="mainImage"
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              style={{ display: "none" }}
            />
          </label>

          <div className="uploaded-images">
            <div className="uploaded-image-container">
              {
                <div className="uploaded-images">
                  <div className="uploaded-image-container">
                    <img
                      src={
                        typeof mainImage === "string" &&
                        mainImage.startsWith("/uploads")
                          ? `https://escortnights.dk/backend-martin/public/${mainImage}`
                          : mainImage
                      }
                      alt="Main Upload"
                      className="uploaded-image"
                      onError={(e) => {
                        if (
                          !mainImage.startsWith("blob:") &&
                          !mainImage.includes("backend-martin/public/")
                        ) {
                          e.target.src = `https://escortnights.dk/backend-martin/public/${mainImage}`;
                        }
                      }}
                    />
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <div className="upload-container">
          <h1>
            {" "}
            {language === "en" ? "UPLOAD IMAGES SHOTS" : "UPLOAD BILLEDER"}
          </h1>
          <label className="upload-label" htmlFor="uploadimages">
            <div className="upload-area">
              <p>
                {" "}
                {language === "en" ? "UPLOAD IMAGES SHOTS" : "UPLOAD BILLEDER"}
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
          <div className="uploaded-images">
            {mediaImages?.map((image, index) => (
              <div key={index} className="gallery-item">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Gallery ${index + 1}`}
                  onError={(e) => {
                    if (
                      !image.startsWith("blob:") &&
                      !image.includes("backend-martin/public/")
                    ) {
                      e.target.src = `https://escortnights.dk/backend-martin/public/${image}`;
                    }
                  }}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
                <button
                  className="mt-1"
                  onClick={() => handleRemoveImage(index)}
                >
                  {language === "en" ? "   Remove" : "Fjern"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Multiple Videos Upload Section */}
        <div className="upload-container">
          <h1>
            {" "}
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
              onChange={handleVideosFileChange}
              style={{ display: "none" }}
            />
          </label>
          <div className="uploaded-images">
            {mediaVideos?.map((video, index) => (
              <div key={index} className="gallery-item">
                <video
                  src={video}
                  controls
                  width="200"
                  onError={(e) => {
                    if (
                      !video.startsWith("blob:") &&
                      !video.includes("backend-martin/public/")
                    ) {
                      e.target.src = `https://escortnights.dk/backend-martin/public/${video}`;
                    }
                  }}
                ></video>
                <button onClick={() => handleRemoveVideo(index)}>
                  {" "}
                  {language === "en" ? "   Remove" : "Fjern"}
                </button>
              </div>
            ))}
            {/* <div className="uploaded-images">
  {mediaImageIds?.map((id, index) => (
    <div key={id} className="uploaded-image-container">
      <p>Image ID: {id}</p>
      <img
        src={mediaImages[index] || "/placeholder.svg"}
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
</div> */}
          </div>
        </div>
        <div className="submit-button">
          <button disabled={loader} onClick={handleUpdateProfile}>
            {loader
              ? "updating..."
              : language === "en"
              ? "Update Profile"
              : "Update Profil"}
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default UpdateProfile;
