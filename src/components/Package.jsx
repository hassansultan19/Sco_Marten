import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const Package = ({
  userPackages,
  title,
  id,
  price,
  description,
  duration,
  icon: Icon,
  isPopular,
  handleCreatePayment,
  loading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasActivePackage = !!userPackages?.id; // Check if user already has any package
  const isCurrentPackage = userPackages?.package?.id === id; // Check if this package is the one user owns

  const openModal = () => {
    if (!hasActivePackage) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div
      className={`relative w-full flex flex-col px-7 py-6 rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl ${
        isPopular ? "border-2 border-red-500" : ""
      } ${
        isCurrentPackage
          ? "bg-red-600 text-white border-2 border-red-500" // Highlight the package the user owns
          : "bg-white text-black"
      } ${
        hasActivePackage && !isCurrentPackage
          ? "bg-gray-300 cursor-not-allowed"
          : ""
      }
      `}
    >
      {title === "Standard" && (
        <div className="absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-bl-lg rounded-tr-lg">
          Most Popular
        </div>
      )}
      <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full">
        <Icon
          className={`w-10 h-10 ${
            isCurrentPackage ? "text-black" : "text-red-700"
          }`}
        />
      </div>
      <h2
        className={`mb-2 text-2xl font-bold text-center ${
          isCurrentPackage ? "text-white" : "text-black"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mb-6 text-4xl font-bold text-center ${
          isCurrentPackage ? "text-white" : "text-red-700"
        }`}
      >
        {price}/{duration} Days
      </p>
      <ul className="flex-grow mb-6 space-y-3">
        <p
          className={`text-gray-700 h-32 ${
            isCurrentPackage ? "text-white" : "text-gray-700"
          }`}
        >
          {description}
        </p>
      </ul>
      <button
        onClick={openModal}
        disabled={hasActivePackage} // Disable button if user already has a package
        className={`w-full px-4 py-3 font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
          hasActivePackage
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-black hover:bg-red-700 text-white"
        }`}
      >
        {isCurrentPackage
          ? "Current Plan"
          : hasActivePackage
          ? "Already Subscribed"
          : "Choose Plan"}
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleCreatePayment}
        packageName={title}
        packagePrice={price}
        id={id}
        loading={loading}
        duration={duration}
      />
    </div>
  );
};

export default Package;
