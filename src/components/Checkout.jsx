import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

function Checkout({ price, package_id }) {
  const router = useNavigate();
  const handlePaymentSuccess = async (orderData, package_id) => {
    try {
      setLoading(true);

      const token = orderData.id;
      const userId = localStorage.getItem("userId");

      const res = await axios.post(
        "https://escortnights.dk/backend-martin/public/api/admin/paypal/capture-payment",
        {
          token: token,
          package_id: Number(package_id),
          user_id: Number(userId),
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await res.data;

      if (data.status === "success") {
        toast.success("Payment successful!");
        onSuccess(data?.data);
        router("/");
      } else {
        toast.error("Payment failed or was not processed.");
      }
    } catch (error) {
      toast.error("Payment failed or was not processed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AT5sriG61vcAodXCaFX9n3CW1AA3NjgP-lwKooZJAchdyHyu9HKnucoKW3i2oCxza2CNr4dSwBA9UFm7",
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
