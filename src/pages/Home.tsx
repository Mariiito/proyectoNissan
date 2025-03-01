import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDown, Info, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [progress] = useState(0);
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(getCurrentTime());
    const [showMobilePreview, setShowMobilePreview] = useState(false);

    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        return formattedTime;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 60000);

        // Check window size on mount and resize
        const handleResize = () => {
            setShowMobilePreview(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLogout = () => {
        console.log('Sesión cerrada');
        navigate('/');
    };

    const toggleMobilePreview = () => {
        setShowMobilePreview(!showMobilePreview);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen relative">
            {/* Main Content */}
            <div className={`w-full ${!showMobilePreview ? 'md:w-3/4 lg:w-4/5' : 'md:w-full'} p-4 md:p-6 overflow-y-auto`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <FontAwesomeIcon icon={faWhatsapp} className="w-8 h-8 text-[#7b1fa2]" />
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold">Envío de mensajes masivos</h2>
                            <p className="text-gray-400 text-sm md:text-base">
                                Envía mensajes masivos seleccionando una campaña, una plantilla y un rango de mensajes.
                            </p>
                        </div>
                    </div>

                    {/* Botones a la derecha */}
                    <div className="flex items-center gap-3 md:gap-4 justify-between w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <select
                                className="w-full sm:w-auto flex items-center bg-[#333] px-4 sm:px-9 py-2 sm:py-2.5 rounded appearance-none cursor-pointer text-white text-sm md:text-base"
                            >
                                <option value="Pruebas">Pruebas</option>
                                <option value="Prueba 1">Pruebas 1</option>
                                <option value="Prueba 2">Pruebas 2</option>
                                <option value="Prueba 3">Pruebas 3</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded text-sm md:text-base whitespace-nowrap"
                            onClick={handleLogout}
                        >
                            Cerrar sesión
                        </button>

                        {/* Mobile preview toggle button - only visible on mobile */}
                        <button
                            className="md:hidden bg-[#7b1fa2] text-white px-3 py-2 rounded"
                            onClick={toggleMobilePreview}
                        >
                            {showMobilePreview ? 'Ver formulario' : 'Ver vista previa'}
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-[#333] h-1 rounded mb-6">
                    <div
                        className="bg-[#7b1fa2] h-full rounded transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Form content - hide on mobile when preview is shown */}
                <div className={`space-y-4 md:space-y-6 ${showMobilePreview ? 'hidden md:block' : 'block'}`}>
                    {/* Camapaña / Campaign */}
                    <div className="bg-[#2a2a2a] p-4 md:p-6 rounded-lg">
                        <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#333] flex items-center justify-center text-sm md:text-base">
                                1
                            </div>
                            <h3 className="text-lg md:text-xl">Campaña</h3>
                            <span className="text-gray-400 text-xs md:text-sm ml-auto">
                                Disponible al seleccionar la subcuenta
                            </span>
                        </div>
                        <select className="w-full bg-[#333] border-0 rounded p-2 md:p-3 text-white text-sm md:text-base">
                            <option value="">Selecciona una campaña</option>
                            <option value="1">Campaña 1</option>
                            <option value="2">Campaña 2</option>
                        </select>
                    </div>

                    {/* Plantilla / Template */}
                    <div className="bg-[#2a2a2a] p-4 md:p-6 rounded-lg">
                        <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#333] flex items-center justify-center text-sm md:text-base">
                                2
                            </div>
                            <h3 className="text-lg md:text-xl">Plantilla</h3>
                            <span className="text-gray-400 text-xs md:text-sm ml-auto">
                                Disponible al seleccionar la campaña
                            </span>
                        </div>
                        <select className="w-full bg-[#333] border-0 rounded p-2 md:p-3 text-white text-sm md:text-base">
                            <option value="">Seleccionar Plantilla</option>
                            <option value="1">Plantilla 1</option>
                            <option value="2">Plantilla 2</option>
                        </select>
                    </div>

                    {/* Destinatario */}
                    <div className="bg-[#2a2a2a] p-4 md:p-6 rounded-lg">
                        <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#333] flex items-center justify-center text-sm md:text-base">
                                3
                            </div>
                            <h3 className="text-lg md:text-xl">Destinatarios</h3>
                            <span className="text-gray-400 text-xs md:text-sm ml-auto">
                                Disponible al seleccionar la campaña
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs md:text-sm text-gray-400">Desde</label>
                                <input
                                    type="number"
                                    className="w-full bg-[#333] border-0 rounded p-2 md:p-3 mt-1 text-white text-sm md:text-base"
                                    placeholder="1"
                                />
                            </div>
                            <div>
                                <label className="text-xs md:text-sm text-gray-400">Hasta</label>
                                <input
                                    type="number"
                                    className="w-full bg-[#333] border-0 rounded p-2 md:p-3 mt-1 text-white text-sm md:text-base"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs md:text-sm mt-2">
                            Ejemplo: 1000 - 1500 (500 destinatarios)
                        </p>
                    </div>

                    {/* Numero de telefono */}
                    <div className="bg-[#2a2a2a] p-4 md:p-6 rounded-lg">
                        <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#333] flex items-center justify-center text-sm md:text-base">
                                4
                            </div>
                            <h3 className="text-lg md:text-xl">Número de teléfono</h3>
                            <span className="text-gray-400 text-xs md:text-sm ml-auto">
                                Disponible al seleccionar un rango
                            </span>
                        </div>
                        <select className="w-full bg-[#333] border-0 rounded p-2 md:p-3 text-white text-sm md:text-base">
                            <option value="">Seleccionar número de teléfono</option>
                            <option value="1">+1 234 567 8900</option>
                            <option value="2">+1 234 567 8901</option>
                        </select>
                    </div>

                    {/* Botón de enviar mensaje */}
                    <div className="flex justify-center mt-6 md:mt-8">
                        <button
                            className="bg-[#7b1fa2] hover:bg-[#9c27b0] text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base">
                            Enviar Mensaje
                        </button>
                    </div>
                </div>
            </div>

            {/* Phone Preview - for desktop always visible, for mobile toggleable */}
            <div className={`
                ${showMobilePreview ? 'block' : 'hidden md:block'}
                w-full md:w-1/4 lg:w-1/5 bg-[#2a2a2a] border-l border-[#333]
                flex flex-col fixed md:static right-0 top-0 bottom-0 z-10
            `}>
                {/* Top Bar (Time and Contact) */}
                <div className="flex items-center justify-between p-3 md:p-4">
                    <span className="text-gray-400 text-xs md:text-sm">{currentTime}</span>
                    <div className="flex items-center gap-1 md:gap-2">
                        <Info size={14} className="text-[#7b1fa2]" />
                        <span className="text-[#7b1fa2] text-xs md:text-sm">Contacto</span>
                    </div>
                </div>

                {/* Content Area (like phone screen) - Ahora ocupa todo el espacio disponible */}
                <div className="bg-[#333] rounded-lg mx-4 md:mx-4 mt-2 md:mt-4 mb-2 md:mb-4 p-4 flex-grow flex flex-col items-center justify-center text-center">
                    <FileText size={36} className="text-gray-500" />
                    <p className="text-gray-400 text-xs md:text-sm mt-3">Seleccione una plantilla para ver su mensaje</p>
                </div>

                {/* Bottom area (simulating phone bottom) */}
                <div className="p-2 md:p-4">
                    {/* Add anything you want to display at the bottom here */}
                </div>
            </div>
        </div>
    );
};

export default Home;