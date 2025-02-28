import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CiMonitor } from "react-icons/ci";
import { MdAdminPanelSettings } from "react-icons/md"; // Importamos un ícono para Admin
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'; // Importa useState y useEffect

const Layout = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [activeRoute, setActiveRoute] = useState(pathname);  // Estado para la ruta activa

    useEffect(() => {
        setActiveRoute(pathname); // Actualiza la ruta activa al cambiar el pathname
    }, [pathname]);

    const handleMonitorClick = () => {
        navigate('/monitor'); // Navega a la ruta "/monitor" (Monitor)
    };

    const handleMessageClick = () => {
        navigate('/home'); // Navega a la ruta "/home" (Home)
    };

    const handleAdminClick = () => {
        navigate('/admin'); // Navega a la ruta "/admin" (Admin)
    };

    if (pathname === '/') return <Outlet />

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white flex" style={{ position: 'relative', zIndex: 1 }}>
            {/* Sidebar */}
            <div className="w-64 bg-[#4a148c] p-4" style={{ position: 'relative', zIndex: 2 }}>
                <div className="flex items-center gap-2 mb-8">
                    <img src="./img/icon.png" alt="icon" className="w-30 h-15 rounded" />
                </div>
                <nav style={{ position: 'relative', zIndex: 3 }}>
                    {/* Enlace al componente Monitor */}
                    <div
                        className={`flex items-center gap-2 p-3 rounded hover:bg-[#7b1fa2] cursor-pointer ${activeRoute === '/monitor' ? 'bg-[#7b1fa2]' : ''}`}
                        onClick={handleMonitorClick}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <CiMonitor size={20} />
                        <span>Monitor</span>
                    </div>
                    
                    {/* Enlace al componente Mensaje (Home) */}
                    <div
                        className={`flex items-center gap-2 p-3 rounded hover:bg-[#7b1fa2] cursor-pointer ${activeRoute === '/home' ? 'bg-[#7b1fa2]' : ''}`}
                        onClick={handleMessageClick}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5 text-white" />
                        <span>Mensaje</span>
                    </div>
                    
                    {/* Nuevo enlace al componente Admin */}
                    <div
                        className={`flex items-center gap-2 p-3 rounded hover:bg-[#7b1fa2] cursor-pointer ${activeRoute === '/admin' ? 'bg-[#7b1fa2]' : ''}`}
                        onClick={handleAdminClick}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <MdAdminPanelSettings size={20} />
                        <span>Admin</span>
                    </div>
                </nav>
            </div>
            <div className="flex-1" style={{ position: 'relative', zIndex: 1 }}> 
                <Outlet /> 
            </div>
        </div>
    )
}

export default Layout