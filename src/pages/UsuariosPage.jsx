import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { usuariosAPI, perfilesAPI } from '../services/api';
import axios from '../config/axios';
import { FiPlus, FiDownload, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import UsuarioStats from '../components/usuarios/UsuarioStats';
import UsuarioFilters from '../components/usuarios/UsuarioFilters';
import UsuariosTable from '../components/usuarios/UsuariosTable';
import UsuarioModal from '../components/usuarios/UsuarioModal';
import ValidationModal from '../components/common/ValidationModal';
import ConfirmModal from '../components/common/ConfirmModal';

const UsuariosPage = () => {
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [usuarioToDelete, setUsuarioToDelete] = useState(null);
    const [sucursalInfo, setSucursalInfo] = useState(null);
    const [filters, setFilters] = useState({
        perfil: null,
        estado: null,
        sucursal: null
    });

    // Cargar información de la sucursal si el usuario es administrador local
    useEffect(() => {
        if (currentUser?.idSucursal && currentUser.idSucursal > 0) {
            const fetchSucursalInfo = async () => {
                try {
                    const response = await axios.get(`/restful/sucursales/${currentUser.idSucursal}`);
                    setSucursalInfo(response.data);
                } catch (err) {
                    console.log('No se pudo cargar info de sucursal');
                }
            };
            fetchSucursalInfo();
        }
    }, [currentUser]);

    // Fetch users and profiles
    const { data: usuariosData, isLoading } = useQuery({
        queryKey: ['usuarios'],
        queryFn: async () => {
            const [usuariosRes, perfilesRes] = await Promise.all([
                usuariosAPI.getAll(),
                perfilesAPI.getAll()
            ]);

            const perfilesMap = new Map(perfilesRes.data.map(p => [p.idPerfil, p.nombrePerfil]));

            return usuariosRes.data.map(usuario => ({
                ...usuario,
                nombrePerfil: perfilesMap.get(usuario.rolId) || 'Sin Perfil'
            }));
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => usuariosAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['usuarios']);
        },
        onError: () => {
            toast.error('Error al eliminar usuario');
        }
    });

    const handleCreate = () => {
        setSelectedUsuario(null);
        setIsAdminMode(false);
        setShowModal(true);
    };

    const handleCreateAdmin = () => {
        setSelectedUsuario(null);
        setIsAdminMode(true);
        setShowModal(true);
    };

    const handleEdit = (usuario) => {
        setSelectedUsuario(usuario);
        setIsAdminMode(false);
        setShowModal(true);
    };

    const handleDelete = (usuario) => {
        setUsuarioToDelete(usuario);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        setShowConfirmModal(false);
        try {
            await deleteMutation.mutateAsync(usuarioToDelete.idUsuario);
            setDeleteMessage('✓ Usuario eliminado correctamente');
            setShowDeleteModal(true);
            setTimeout(() => {
                setShowDeleteModal(false);
            }, 2000);
        } catch (error) {
            console.error('Error deleting usuario:', error);
            setDeleteMessage('Error al eliminar el usuario');
            setShowDeleteModal(true);
        }
        setUsuarioToDelete(null);
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setUsuarioToDelete(null);
    };

    // Filter logic - Solo mostrar usuarios activos por defecto
    const filteredUsuarios = usuariosData?.filter(usuario => {
        // Filtrar solo usuarios activos (estado = 1) - oculta los eliminados lógicamente
        if (usuario.estado !== 1) return false;

        // Si el usuario actual es administrador local (tiene sucursal asignada),
        // solo mostrar usuarios de su sucursal
        if (currentUser?.idSucursal && currentUser.idSucursal > 0) {
            if (usuario.idSucursal !== currentUser.idSucursal) return false;
        }

        if (filters.perfil && usuario.rolId !== filters.perfil) return false;
        if (filters.estado !== null && usuario.estado !== filters.estado) return false;
        return true;
    }) || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-coffee-800 font-serif">Gestión de Usuarios</h1>
                    <p className="text-gray-600 mt-1">Administra el acceso y roles del personal</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition">
                        <FiUpload size={18} />
                        <span className="hidden sm:inline">Importar</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition">
                        <FiDownload size={18} />
                        <span className="hidden sm:inline">Exportar</span>
                    </button>
                    {/* ✅ Nuevo botón para crear administrador */}
                    <button
                        onClick={handleCreateAdmin}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-md"
                    >
                        <FiPlus size={20} />
                        <span className="hidden sm:inline">Nuevo Admin</span>
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition shadow-md"
                    >
                        <FiPlus size={20} />
                        <span>Nuevo Usuario</span>
                    </button>
                </div>
            </div>

            <UsuarioStats usuarios={filteredUsuarios} />

            <UsuarioFilters filters={filters} setFilters={setFilters} />

            <UsuariosTable
                usuarios={filteredUsuarios}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {showModal && (
                <UsuarioModal
                    usuario={selectedUsuario}
                    onClose={() => setShowModal(false)}
                    isAdmin={isAdminMode}
                />
            )}

            {/* Delete Validation Modal */}
            <ValidationModal
                show={showDeleteModal}
                type={deleteMessage.includes('Error') ? 'error' : 'success'}
                message={deleteMessage}
                onClose={() => setShowDeleteModal(false)}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                show={showConfirmModal}
                title="Confirmar eliminación"
                message={usuarioToDelete ? `¿Desea eliminar al usuario ${usuarioToDelete.nombreUsuario}?` : ''}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                confirmText="Aceptar"
                cancelText="Cancelar"
            />
        </div>
    );
};

export default UsuariosPage;
