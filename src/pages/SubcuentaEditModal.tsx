// SubcuentaEditModal.tsx
import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

interface Subcuenta {
    id: number;
    usuario: number;  // Cambiar de user_id a usuario
    nombre: string;   // Cambiar de name a nombre
    creado: string;   // Cambiar de created_at a creado
    actualizado: string; // Cambiar de updated_at a actualizado
}

interface SubcuentaEditModalProps {
    subcuenta: Subcuenta | null;
    onClose: () => void;
    onSave: (updatedSubcuenta: Subcuenta) => void;
    isOpen: boolean;    
     
}

const SubcuentaEditModal: React.FC<SubcuentaEditModalProps> = ({ subcuenta, onClose, onSave, isOpen }) => {
    const [formData, setFormData] = useState<Subcuenta | null>(null);

    useEffect(() => {
        if (subcuenta) {
            setFormData({ ...subcuenta });
        }
    }, [subcuenta]);

    if (!isOpen || !formData) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                [name]: name === 'usuario' ? Number(value) : value
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white rounded-md shadow-lg w-full max-w-3xl relative">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold">Editar datos de subcuenta</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FaTimesCircle size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre</label>
                            <input
                                type="text"
                                name="nombre"  // Cambiar de name a nombre
                                value={formData.nombre}  // Cambiar de name a nombre
                                onChange={handleInputChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <div className="text-right text-xs text-gray-400">{formData.nombre.length} / 50</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Usuario (ID)</label>
                            <input
                                type="text"
                                name="usuario"
                                value={formData.usuario}
                                disabled
                                className="w-full p-2 bg-gray-600 border border-gray-600 rounded text-white cursor-not-allowed"
                            />
                            <div className="text-xs text-gray-400 mt-1">ID del usuario (no editable)</div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Aceptar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubcuentaEditModal;