import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';

const DashboardPage = () => {
    const { user } = useAuth();
    const [accesos, setAccesos] = useState([]);
    const [usuariosSucursal, setUsuariosSucursal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sucursalInfo, setSucursalInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.idPerfil) {
                setLoading(false);
                return;
            }

            try {
                // Cargar accesos del perfil
                const accesoResponse = await axios.get(`/accesos/perfil/${user.idPerfil}/completo`);
                setAccesos(accesoResponse.data);

                // Si el usuario es administrador y tiene sucursal asignada, cargar usuarios de esa sucursal
                if (user.idSucursal && user.idSucursal > 0) {
                    const usuariosResponse = await axios.get(`/restful/usuarios/sucursal/${user.idSucursal}`);
                    setUsuariosSucursal(usuariosResponse.data);
                    
                    // Cargar info de la sucursal
                    try {
                        const sucursalResponse = await axios.get(`/restful/sucursales/${user.idSucursal}`);
                        setSucursalInfo(sucursalResponse.data);
                    } catch (err) {
                        console.log('No se pudo cargar info de sucursal');
                    }
                }
            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError('No se pudieron cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

            {/* Info de sucursal si es administrador local */}
            {user.idSucursal && user.idSucursal > 0 && (
                <div className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-bold mb-2">
                        🏢 {sucursalInfo?.nombre || `Sucursal #${user.idSucursal}`}
                    </h2>
                    {sucursalInfo?.direccion && (
                        <p className="text-terracotta-100">📍 {sucursalInfo.direccion}</p>
                    )}
                </div>
            )}

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

                {user.idSucursal && user.idSucursal > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                        <h3 className="text-lg font-semibold text-gray-700">Usuarios de Sucursal</h3>
                        <p className="text-3xl font-bold text-purple-600 mt-2">{usuariosSucursal.length}</p>
                        <p className="text-sm text-gray-500 mt-1">usuarios en tu sucursal</p>
                    </div>
                )}

                {!user.idSucursal && (
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-700">Acceso Rápido</h3>
                        <p className="text-gray-500 mt-2 text-sm">
                            Selecciona una opción del menú lateral para comenzar.
                        </p>
                    </div>
                )}
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

            {/* Lista de usuarios de la sucursal si es administrador local */}
            {user.idSucursal && user.idSucursal > 0 && usuariosSucursal.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Usuarios de tu Sucursal</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Usuario</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Perfil</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosSucursal.map((u) => (
                                    <tr key={u.idUsuario} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-800">{u.nombreUsuario} {u.apellidos}</td>
                                        <td className="px-4 py-3 text-gray-600">{u.nombreUsuarioLogin}</td>
                                        <td className="px-4 py-3 text-gray-600">ID: {u.rolId}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.estado === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {u.estado === 1 ? '✓ Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;

