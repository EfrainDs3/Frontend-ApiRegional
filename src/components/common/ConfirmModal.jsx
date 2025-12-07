import { FiAlertCircle } from 'react-icons/fi';

/**
 * ConfirmModal - Reusable confirmation modal component
 * @param {boolean} show - Controls modal visibility
 * @param {string} title - Title of the confirmation
 * @param {string} message - Confirmation message to display
 * @param {function} onConfirm - Callback when confirmed
 * @param {function} onCancel - Callback when cancelled
 * @param {string} confirmText - Text for confirm button (default: "Aceptar")
 * @param {string} cancelText - Text for cancel button (default: "Cancelar")
 */
export default function ConfirmModal({
    show,
    title = "Confirmación",
    message,
    onConfirm,
    onCancel,
    confirmText = "Aceptar",
    cancelText = "Cancelar"
}) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 flex flex-col items-center text-center space-y-4">
                {/* Icon Circle */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-yellow-300 bg-yellow-50">
                    <FiAlertCircle size={32} className="text-yellow-500" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>

                {/* Message */}
                <p className="text-gray-600 text-base">{message}</p>

                {/* Buttons */}
                <div className="flex gap-3 w-full pt-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
