import { FaTimesCircle } from "react-icons/fa"

const PaymentRejected= () => {
  return (
      <div className="bg-gradient-to-br from-slate-950 min-h-[90vh] py-5 flex flex-col items-center justify-center w-full to-gray-950 rounded-3xl shadow-2xl p-8 text-center">
        <div className="bg-red-700 rounded-full p-3 mx-auto mb-6 w-20 h-20 flex items-center justify-center">
          <FaTimesCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Payment Failed</h1>
        <p className="text-gray-300 mb-6">
          We're sorry, but your payment could not be processed. Please try again or use a different payment method.
        </p>
        <div className="bg-gray-700 rounded-xl p-4 mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Possible Reasons</h2>
          <ul className="text-gray-300 text-left list-disc list-inside">
            <li>Insufficient funds</li>
            <li>Incorrect payment details</li>
            <li>Temporary issue with the payment gateway</li>
          </ul>
        </div>
        <div className="space-y-4">
          <a
            href="/retry-payment"
            className="inline-block bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 w-full"
          >
            Try Again
          </a>
          <a
            href="/contact-support"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 w-full"
          >
            Contact Support
          </a>
        </div>
      </div>
  )
}

export default PaymentRejected

