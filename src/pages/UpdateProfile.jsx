import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Flower from "../components/Flower";
import Flowerright from "../components/Flowerright";
import Footer from "../components/Footer";
import "../pages/Registration.css";
import Swal from "sweetalert2";

const UpdateProfile = () => {
  const [packages, setPackages] = useState([]); // Store packages data
  const [selectedPackage, setSelectedPackage] = useState(null); // Store selected package
  const [userData, setUserData] = useState({});
  const [allInterests, setAllInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [mainImage, setMainImage] = useState(null); // Store the File object for main image
  const [mediaImages, setMediaImages] = useState([]); // Store File objects for media images
  const [mediaVideos, setMediaVideos] = useState([]); // Store File objects for media images
  const [mediaImagePreviews, setMediaImagePreviews] = useState([]); // Store previews of media images
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [deletedVideosFiles, setDeletedVideoFiles] = useState([]);
  const addressInputRef = useRef(null);
  const [showDays, setShowDays] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null); // Actual file
  const [mediaFiles, setMediaFiles] = useState([]); // Actual files
  const [mediaVideosFiles, setMediaVideosFiles] = useState([]); // Actual files

  const handleCheckboxChange = (e) => {
    setShowDays(e.target.checked); // Show or hide days based on checkbox
  };
  const handleDayClick = (day) => {
    setSelectedDay(day); // Update selected day
  };
  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const response = await axios.get(
          "https://escort.odhostestingweblinks.com/api/admin/packages",
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
  // Fetch all interests
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      Swal.fire({
        title: "Not Logged In",
        text: "Please log in to update your profile.",
        icon: "warning",
        confirmButtonText: "OK",
        allowOutsideClick: false, // Prevent closing on outside click
      }).then(() => {
        // Redirect to the login page
        window.location.href = "/login"; // Change '/login' to your actual login page route
      });
      return;
    }

    const fetchInterests = async () => {
      try {
        const response = await axios.get(
          "https://escort.odhostestingweblinks.com/api/auth/interests"
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
  const [mediaVideosIds, setMediaVideosIds] = useState([]);

  // Fetch user data and saved interests
  useEffect(() => {
    const guid = sessionStorage.getItem("guid");
    if (guid) {
      axios
        .get(
          `https://escort.odhostestingweblinks.com/api/escort/getById/${guid}`
        )
        .then((response) => {
          const escortData = response.data.data.escort;
          setUserData(escortData);
          setMainImageFile(escortData.main_image);
          setMainImage(escortData.main_image);

          // Set media images and deleted IDs
          setMediaImages(escortData.images.map((item) => item.original_url));

          setMediaImageIds(escortData.images.map((item) => item.id));

          // Set media videos and deleted IDs
          setMediaVideos(escortData.videos.map((item) => item.original_url));

          setMediaVideosIds(escortData.videos.map((item) => item.id));

          const userInterests = escortData.user_interest.map(
            (item) => item.interest_id
          );
          setSelectedInterests(userInterests);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        types: ["(regions)"], // Restrict input to regions (or modify as needed)
        componentRestrictions: { country: ["us"] }, // Adjust as per your requirement
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
      const preview = URL.createObjectURL(file); // For display purposes
      setMainImageFile(file); // Store the actual file
      setMainImage(preview); // Store the preview for display
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file)); // Generate previews for new files

    // Append new files and their previews to the existing ones
    setMediaImages((prev) => [...prev, ...previews]);
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const handleVideosFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file)); // Generate previews for new files

    // Append new files and their previews to the existing ones
    setMediaVideos((prev) => [...prev, ...previews]);
    setMediaVideosFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    // Add the ID of the removed image to deletedFiles
    setDeletedFiles((prev) => [...prev, mediaImageIds[index]]);

    // Remove the preview of the image
    setMediaImages((prev) => prev.filter((_, i) => i !== index));

    // Remove the ID of the image from mediaImageIds
    setMediaImageIds((prev) => prev.filter((_, i) => i !== index));
  };
  const handleRemoveVideos = (index) => {
    // Add the ID of the removed image to deletedFiles
    setDeletedVideoFiles((prev) => [...prev, mediaVideosIds[index]]);

    // Remove the preview of the image
    setMediaVideos((prev) => prev.filter((_, i) => i !== index));

    // Remove the ID of the image from mediaImageIds
    setMediaVideosIds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setMediaImages([]);
    setMediaFiles([]);
  };

  const handleUpdateProfile = async () => {
    const token = sessionStorage.getItem("authToken"); // Get token from session storage
    if (!token) return alert("Please log in to update your profile");

    const formData = new FormData();
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

    // Append the main image
    if (mainImageFile) {
      // Append the new main image if user updated it
      formData.append("main_image", mainImageFile);
    } else if (mainImage) {
      // Fetch and append the existing main image as binary data
      try {
        const response = await fetch(mainImage);
        const blob = await response.blob();
        formData.append("main_image", blob, "main_image.jpg");
      } catch (error) {
        console.error("Failed to fetch existing main image:", error);
      }
    }
    // Append all media files
    mediaFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
    mediaVideosFiles.forEach((file, index) => {
      formData.append(`videos[${index}]`, file);
    });
    formData.append("user_interests", JSON.stringify(selectedInterests));
    // Append deleted file IDs
    formData.append("deleted_files", JSON.stringify(deletedFiles));
    formData.append("deleted_video_files", JSON.stringify(deletedVideosFiles));

    try {
      const response = await axios.post(
        "https://escort.odhostestingweblinks.com/api/escort/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success popup with SweetAlert2
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
        // Perform any additional actions here, such as reloading data or redirecting
      });
    } catch (error) {
      console.error("Error updating profile:", error);

      // Show error popup with SweetAlert2
      Swal.fire({
        title: "Update Failed",
        text: "There was an error updating your profile. Please try again.",
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
    if (showDays === true) {
      try {
        const response = await axios.post(
          "https://escort.odhostestingweblinks.com/api/escort/update-featured",
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

  return (
    <>
      <div className="container mx-auto">
        <div className="heading">
          <h1 style={{ fontFamily: "Recoleta-Regular", marginTop: "3vw" }}>
            Update Profile
          </h1>
        </div>

        <div className="inputs">
          <div className="first-sec">
            <Flowerright />
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name || ""}
              placeholder="Your Name"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email || ""}
              placeholder="Email"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />

            <label htmlFor="phone_code">Phone </label>
            <input
              type="number"
              name="phone_number"
              value={userData.phone_number || ""}
              placeholder="Phone Number"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, phone_number: e.target.value })
              }
            />

            <label htmlFor="zip_code">Zip Code</label>
            <input
              type="text"
              name="zip_code"
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

            <label htmlFor="city">City</label>
            {/* Autofilled Fields */}
            <input
              type="text"
              name="city"
              value={userData.city || ""}
              placeholder="City"
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
            <label htmlFor="hair_color">Hair color</label>
            <input
              type="text"
              name="hair_color"
              value={userData.hair_color || ""}
              placeholder="Hair Color"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, hair_color: e.target.value })
              }
            />
          </div>

          <div className="second-sec">
            <label htmlFor="age">Age</label>
            <input
              type="text"
              name="age"
              value={userData.age || ""}
              placeholder="Your Age"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, age: e.target.value })
              }
            />
            <label htmlFor="height">Height</label>
            <input
              type="text"
              name="height"
              value={userData.height || ""}
              placeholder="Your Height (CM)"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, height: e.target.value })
              }
            />
            <label htmlFor="weight">Weight</label>
            <input
              type="text"
              name="burst"
              value={userData.burst || ""}
              placeholder="Burst Size"
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
              <option value="">Select Sex</option>
              <option value="man">Man</option>
              <option value="woman">Woman</option>
            </select>

            {/* City Autocomplete */}
            <label htmlFor="eye_color">Eye Color</label>
            <input
              type="text"
              name="eye_color"
              value={userData.eye_color || ""}
              placeholder="Eye Color"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, eye_color: e.target.value })
              }
            />
            <label htmlFor="weight">Weight</label>
            <input
              type="text"
              name="weight"
              value={userData.weight || ""}
              placeholder="Your Weight (IB)"
              className="input input-bordered input-primary"
              onChange={(e) =>
                setUserData({ ...userData, weight: e.target.value })
              }
            />
          </div>
        </div>
        <div className="inputs">
          <div className="second-sec">
            <label htmlFor="about">About</label>
            <textarea
              name="about"
              value={userData.about || ""}
              placeholder="About Me"
              className="about-me-textarea"
              onChange={(e) =>
                setUserData({ ...userData, about: e.target.value })
              }
            ></textarea>
          </div>
        </div>
        <div className="field-container">
          <h1 style={{ fontFamily: "Recoleta-Regular" }}>Field Interest</h1>
          <div className="checkbox-container">
            <div className="checkbox-group">
              <div className="checkbox-group">
                {allInterests.map((interest) => (
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
        <div className="field-container">
          <h1 style={{ fontFamily: "Recoleta-Regular" }}>Profile Status</h1>
          <div className="checkbox-container">
            <div className="checkbox-group">
              <label>
                <input type="checkbox" onChange={handleCheckboxChange} />
                Feature Your Profile
              </label>
            </div>
          </div>
        </div>
        {showDays && (
          <div className="field-container">
            <div className="checkbox-container">
              {packages.map((day, index) => (
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
        {/* <div className="field-container">
        <h1 style={{ fontFamily: "Recoleta-Regular" }}>Field Interest</h1>
        <div className="checkbox-container">
          <div className="checkbox-group">
            <div className="checkbox-group">
              {allInterests.map(interest => (
                <label key={interest.id} className="checkbox-group">
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
      </div> */}

        <div className="upload-container">
          <h1>Main Image Upload</h1>
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
          {mainImage ? (
            <div className="uploaded-images">
              <div className="uploaded-image-container">
                <img
                  src={mainImage}
                  alt="Main Upload"
                  className="uploaded-image"
                />
              </div>
            </div>
          ) : (
            <>
              {mediaImages.slice(0, 1).map((image, index) => (
                <div className="uploaded-images">
                  <div className="uploaded-image-container">
                    <img src={image} alt={`Gallery ${index + 1}`} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Multiple Images Upload Section */}
        <div className="upload-container">
          <h1>UPLOAD IMAGES SHOTS</h1>
          <label className="upload-label" htmlFor="uploadimages">
            <div className="upload-area">
              <p>Browse To Upload</p>
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
            {mediaImages.map((image, index) => (
              <div key={index} className="gallery-item">
                <img src={image} alt={`Gallery ${index + 1}`} />
                <button onClick={() => handleRemoveImage(index)}>Remove</button>
              </div>
            ))}
            {/* <div className="uploaded-images">
  {mediaImageIds.map((id, index) => (
    <div key={id} className="uploaded-image-container">
      <p>Image ID: {id}</p>
      <img
        src={mediaImages[index]}
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

        {/* Multiple Videos Upload Section */}
        <div className="upload-container">
          <h1>UPLOAD VIDEOS SHOTS</h1>
          <label className="upload-label" htmlFor="videos">
            <div className="upload-area">
              <p>Browse To Upload</p>
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
            {mediaVideos.map((video, index) => (
              <div key={index} className="gallery-item">
                <video src={video} controls width="200"></video>
                <button onClick={() => handleRemoveVideos(index)}>
                  Remove
                </button>
              </div>
            ))}
            {/* <div className="uploaded-images">
  {mediaImageIds.map((id, index) => (
    <div key={id} className="uploaded-image-container">
      <p>Image ID: {id}</p>
      <img
        src={mediaImages[index]}
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
          <button onClick={handleUpdateProfile}>Update Profile</button>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default UpdateProfile;
