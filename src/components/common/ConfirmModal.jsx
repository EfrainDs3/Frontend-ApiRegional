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
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 text-white">
                {/* Title */}
                <div className="flex items-center gap-3 mb-4">
                    <FiAlertCircle size={24} className="text-yellow-400" />
                    <h3 className="text-lg font-semibold">{title}</h3>
                </div>

                {/* Message */}
                <p className="text-gray-300 mb-6">{message}</p>

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
