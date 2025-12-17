import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiBell } from 'react-icons/fi';

const Header = () => {
    const { user, logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutModal(false);
        logout();
    };

    return (
        <>
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center z-10">
                <div>
                    <h2 className="text-xl font-bold text-coffee-800 font-serif">
                        Panel Administrativo
                    </h2>
                    <p className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('es-ES', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-terracotta-500 transition relative">
                        <FiBell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div className="h-8 w-px bg-gray-200"></div>

                    <button
                        onClick={handleLogoutClick}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition px-3 py-2 rounded-lg hover:bg-red-50"
                    >
                        <FiLogOut size={18} />
                        <span className="text-sm font-medium">Salir</span>
                    </button>
                </div>
            </header>

            {/* Modal de confirmación de logout */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 flex flex-col items-center text-center space-y-4">
                        <div className="text-6xl">🥺</div>
                        <h3 className="text-2xl font-bold text-coffee-800">¿Deseas cerrar sesión?</h3>
                        <p className="text-gray-600">Tendrás que ingresar nuevamente para acceder al sistema</p>
                        
                        <div className="flex gap-3 w-full pt-4">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            >
                                Sí, cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
