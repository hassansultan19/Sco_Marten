import { FaUserCircle, FaUsersCog, FaChartLine, FaAward } from "react-icons/fa";
import Package from "./Package";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/useUser";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const { userPackages } = useUser();
  const icons = [FaUserCircle, FaUsersCog, FaChartLine, FaAward];
  const fetchBrands = async (page = 1) => {
    try {
      const response = await fetch(
        `https://escortnights.dk/backend-martin/public/api/admin/packages?page=${page}`
      );
      const data = await response.json();
      if (data.status && data.data?.packages) {
        setPackages(data.data.packages);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  console.log("userPackages", userPackages);
  const [loading, setLoading] = useState(false);

  const handleCreatePayment = async (packageId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `https://escortnights.dk/backend-martin/public/api/admin/paypal/create-payment?id=${packageId}`
      );

      if (response.data.status === "success") {
        window.location.href = response.data.redirect_url;
      } else {
        console.error("Error creating PayPal payment:", response.data.message);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-4 text-4xl font-extrabold text-center text-white">
        Feature Profile Packages
      </h1>
      <p className="mb-12 text-xl text-center text-gray-100">
        Choose the perfect plan for your feature profiles
      </p>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {packages?.map((pkg, index) => {
          const Icon = icons[index % icons?.length];
          return (
            <div key={index} className="flex flex-col items-center">
              <Package
                userPackages={userPackages}
                {...pkg}
                icon={Icon}
                handleCreatePayment={handleCreatePayment}
                loading={loading}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Packages;
