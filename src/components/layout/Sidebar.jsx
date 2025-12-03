import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../config/axios';
import {
    FiHome, FiUsers, FiShield, FiGrid, FiLock,
    FiChevronLeft, FiChevronRight, FiChevronDown
} from 'react-icons/fi';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [allowedModules, setAllowedModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState({});

    // El módulo de seguridad (ID 1) incluye estas páginas
    const securityPages = [
        { path: '/usuarios', icon: FiUsers, label: 'Usuarios' },
        { path: '/perfiles', icon: FiShield, label: 'Perfiles' },
        { path: '/modulos', icon: FiGrid, label: 'Módulos' },
        { path: '/accesos', icon: FiLock, label: 'Accesos' },
    ];

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    useEffect(() => {
        const fetchAllowedModules = async () => {
            if (!user || !user.idPerfil) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/accesos/perfil/${user.idPerfil}/completo`);
                setAllowedModules(response.data);
            } catch (err) {
                console.error('Error al cargar módulos permitidos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllowedModules();
    }, [user]);

    // Construir menú dinámico basado en los accesos
    const buildMenuItems = () => {
        const items = [
            { path: '/', icon: FiHome, label: 'Dashboard' } // Dashboard siempre visible
        ];

        allowedModules.forEach(modulo => {
            // Si tiene acceso al módulo de seguridad (ID 1), agregar menú desplegable
            if (modulo.idModulo === 1) {
                items.push({
                    id: 'security',
                    icon: FiShield,
                    label: 'Seguridad',
                    isDropdown: true,
                    submenu: securityPages
                });
            }
            // Otros módulos se agregarán aquí cuando se implementen
        });

        return items;
    };

    const menuItems = buildMenuItems();

    if (loading) {
        return (
            <aside className={`bg-coffee-900 text-cream-100 transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
                <div className="p-4 border-b border-coffee-800 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cream-100"></div>
                </div>
            </aside>
        );
    }

    return (
        <aside
            className={`bg-coffee-900 text-cream-100 transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="p-4 border-b border-coffee-800 flex items-center justify-between">
                {!collapsed && (
                    <h1 className="font-serif font-bold text-lg truncate">
                        Comidas Regionales
                    </h1>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-coffee-800 rounded-lg transition"
                >
                    {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                {menuItems.length === 1 ? (
                    // Solo tiene Dashboard (sin otros accesos)
                    <div className="px-4 py-8 text-center">
                        <p className="text-xs text-cream-200">
                            {!collapsed && 'Sin módulos asignados'}
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-1 px-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const isDropdownExpanded = expandedMenus[item.id];
                            const isSubmenuActive = item.submenu?.some(sub => location.pathname === sub.path);

                            if (item.isDropdown) {
                                return (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => toggleMenu(item.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${isSubmenuActive
                                                ? 'bg-terracotta-500 text-white shadow-md'
                                                : 'hover:bg-coffee-800 text-cream-200'
                                                }`}
                                            title={collapsed ? item.label : ''}
                                        >
                                            <item.icon size={20} />
                                            {!collapsed && (
                                                <>
                                                    <span className="flex-1 text-left">{item.label}</span>
                                                    <FiChevronDown
                                                        size={18}
                                                        className={`transition-transform duration-200 ${isDropdownExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                </>
                                            )}
                                        </button>

                                        {/* Submenu */}
                                        {!collapsed && isDropdownExpanded && (
                                            <ul className="space-y-1 mt-1 ml-2 pl-2 border-l-2 border-coffee-700">
                                                {item.submenu.map((subitem) => {
                                                    const isSubActive = location.pathname === subitem.path;
                                                    return (
                                                        <li key={subitem.path}>
                                                            <Link
                                                                to={subitem.path}
                                                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 text-sm ${isSubActive
                                                                    ? 'bg-terracotta-400 text-white'
                                                                    : 'hover:bg-coffee-800 text-cream-300'
                                                                    }`}
                                                            >
                                                                <subitem.icon size={18} />
                                                                <span>{subitem.label}</span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            }

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${isActive
                                            ? 'bg-terracotta-500 text-white shadow-md'
                                            : 'hover:bg-coffee-800 text-cream-200'
                                            }`}
                                        title={collapsed ? item.label : ''}
                                    >
                                        <item.icon size={20} />
                                        {!collapsed && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-coffee-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-terracotta-600 flex items-center justify-center text-white font-bold">
                        {user?.nombreUsuario?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.nombreUsuario}</p>
                            <p className="text-xs text-cream-200 truncate">{user?.nombrePerfil || 'Usuario'}</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

