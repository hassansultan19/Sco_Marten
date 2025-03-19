import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Checkout({ price, package_id, onClose }) {
  const router = useNavigate();

  const handlePaymentSuccess = async (orderData, package_id) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = orderData.id;
      await axios.post(
        "http://192.168.18.74:800/api/admin/paypal/capture-payment",
        {
          token: token,
          package_id: Number(package_id),
          user_id: Number(userId),
        }
      );

      Swal.fire({
        title: "Feature Successful!",
        text: "You have successfully feature you account.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          content: "swal-content",
          confirmButton: "swal-confirm-button",
        },
      });
      onClose();
      router("/");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AU3WhMDBIPTrVnFsVjb0hyRiWYfHWuBoP_dyInEO9dUR0lZqCpFvZmdO1A-_YDldf6r-l0ikmrNvIQXL",
      }}
    >
      <div className="p-7">
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: price,
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              handlePaymentSuccess(details, package_id);
            });
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}

export default Checkout;
