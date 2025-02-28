import { FaCheckCircle } from "react-icons/fa"


const ConfirmModal = ({ isOpen, onClose,id, onConfirm, packageName,duration,loading ,packagePrice }) => {
  if (!isOpen) return null
 console.log('id', id)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-75 backdrop-blur-sm">
    <div className="relative w-full max-w-md mx-auto my-6">
      <div className="relative flex flex-col w-full bg-gradient-to-br from-gray-900 to-gray-800 bg-black border-0 rounded-3xl shadow-2xl outline-none focus:outline-none">
        <div className="flex flex-col items-center justify-center p-8 border-b border-solid rounded-t-3xl border-gray-700">
          <div className="bg-red-500 rounded-full p-3 mb-4">
            <FaCheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">
            Confirm Your Selection
          </h3>
          <p className="text-lg text-gray-400 text-center">
            You're about to activate the following package:
          </p>
        </div>
        <div className="relative flex-auto p-8">
          <div className="bg-gray-800 rounded-2xl p-6 mb-6">
            <h4 className="text-2xl font-bold text-red-500 mb-2">{packageName}</h4>
            <p className="text-3xl font-bold text-white mb-1">{packagePrice}</p>
            <p className="text-lg text-gray-400">Duration: {duration}/Days</p>
          </div>
          <p className="text-gray-300 text-center">
            By confirming, you agree to the terms and conditions associated with this package.
          </p>
        </div>
        <div className="flex items-center justify-center p-6 border-t border-solid rounded-b-3xl border-gray-700 gap-4">
          <button
            className="px-6 py-3 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded-full outline-none bg-gray-700 hover:bg-gray-600 focus:outline-none"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
          disabled={loading}
            className="px-6 py-3 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded-full shadow outline-none bg-red-500 hover:bg-red-600 focus:outline-none"
            type="button"
            onClick={()=>onConfirm(id)}
          >
        {loading ? 'Processing...' : 'Pay with PayPal'} 
                 </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ConfirmModal

