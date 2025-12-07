import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

/**
 * ValidationModal - Reusable modal component for success/error messages
 * @param {boolean} show - Controls modal visibility
 * @param {string} type - 'success' or 'error'
 * @param {string} message - Message to display
 * @param {function} onClose - Callback when OK button is clicked
 */
export default function ValidationModal({ show, type = 'success', message, onClose }) {
    if (!show) return null;

    const isSuccess = type === 'success';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[61] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 flex flex-col items-center text-center space-y-4">
                {/* Icon Circle */}
                <div
                    className={`flex items-center justify-center w-16 h-16 rounded-full border-4 ${isSuccess
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-400 bg-red-50'
                        }`}
                >
                    {isSuccess ? (
                        <FiCheckCircle size={32} className="text-green-500" />
                    ) : (
                        <FiXCircle size={32} className="text-red-400" />
                    )}
                </div>

                {/* Message */}
                <p className="text-gray-600 text-lg">{message}</p>

                {/* OK Button */}
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
                >
                    OK
                </button>
            </div>
        </div>
    );
}
