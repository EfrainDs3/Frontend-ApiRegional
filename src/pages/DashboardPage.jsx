import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';

const DashboardPage = () => {
    const { user } = useAuth();
    const [accesos, setAccesos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccesos = async () => {
            if (!user || !user.idPerfil) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/accesos/perfil/${user.idPerfil}/completo`);
                setAccesos(response.data);
            } catch (err) {
                console.error('Error al cargar accesos:', err);
                setError('No se pudieron cargar los módulos disponibles');
            } finally {
                setLoading(false);
            }
        };

        fetchAccesos();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando módulos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex items-center">
                    <span className="text-4xl mr-4">⚠️</span>
                    <div>
                        <h3 className="text-lg font-semibold text-red-800">Error</h3>
                        <p className="text-red-600 mt-1">{error}</p>
                        <p className="text-sm text-red-500 mt-2">Por favor, intenta nuevamente más tarde.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Usuario sin accesos
    if (accesos.length === 0) {
        return (
            <div className="max-w-2xl mx-auto mt-12">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-amber-500">
                    <div className="p-8 text-center">
                        <div className="text-6xl mb-4">😔</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Sin Acceso a Módulos</h2>
                        <p className="text-gray-600 mb-2">
                            Tu perfil <span className="font-semibold text-terracotta-600">{user?.nombrePerfil || 'actual'}</span> no tiene acceso a ningún módulo del sistema.
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Esto puede deberse a que tu cuenta está en proceso de configuración o requiere aprobación.
                        </p>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-amber-800">
                                <strong>¿Qué hacer?</strong> Contacta al administrador del sistema para solicitar los permisos necesarios.
                            </p>
                        </div>

                        <div className="text-left bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Información de tu cuenta:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>👤 <strong>Usuario:</strong> {user?.nombreUsuario} {user?.apellidos}</li>
                                <li>🎭 <strong>Perfil:</strong> {user?.nombrePerfil || 'Sin perfil'}</li>
                                <li>📧 <strong>Login:</strong> {user?.nombreUsuarioLogin}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Usuario con accesos - Dashboard normal
    return (
        <div>
            <h1 className="text-3xl font-bold text-coffee-800 font-serif mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-terracotta-500">
                    <h3 className="text-lg font-semibold text-gray-700">Bienvenido</h3>
                    <p className="text-gray-500 mt-2">
                        Hola, <strong>{user?.nombreUsuario}</strong>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Perfil: {user?.nombrePerfil || 'Sin perfil'}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-lg font-semibold text-gray-700">Módulos Disponibles</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{accesos.length}</p>
                    <p className="text-sm text-gray-500 mt-1">módulos asignados</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-lg font-semibold text-gray-700">Acceso Rápido</h3>
                    <p className="text-gray-500 mt-2 text-sm">
                        Selecciona una opción del menú lateral para comenzar.
                    </p>
                </div>
            </div>

            {/* Lista de módulos disponibles */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tus Módulos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accesos.map((acceso) => (
                        <div
                            key={acceso.idAcceso}
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                            <div className="w-10 h-10 bg-terracotta-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-terracotta-600 font-bold">{acceso.orden}</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{acceso.nombreModulo}</p>
                                <p className="text-xs text-gray-500">Módulo {acceso.idModulo}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

