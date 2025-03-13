// NumeroTelefonicoEditModal.tsx
import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

interface NumeroTelefonico {
    id: number;
    nombre: string;
    compania: string;
    numero: string;
    creado: string;
    actualizado: string;
}

interface NumeroTelefonicoEditModalProps {
    numeroTelefonico: NumeroTelefonico | null;
    onClose: () => void;
    onSave: (updatedNumeroTelefonico: NumeroTelefonico) => void;
    isOpen: boolean;
}

const NumeroTelefonicoEditModal: React.FC<NumeroTelefonicoEditModalProps> = ({ numeroTelefonico, onClose, onSave, isOpen }) => {
    const [formData, setFormData] = useState<NumeroTelefonico | null>(null);

    useEffect(() => {
        if (numeroTelefonico) {
            setFormData({ ...numeroTelefonico });
        }
    }, [numeroTelefonico]);

    if (!isOpen || !formData) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                [name]: value
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
                    <h2 className="text-lg font-semibold">Editar datos de {formData.nombre}</h2>
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
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <div className="text-right text-xs text-gray-400">{formData.nombre.length} / 30</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Compañía</label>
                            <input
                                type="text"
                                name="compania"
                                value={formData.compania}
                                onChange={handleInputChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <div className="text-right text-xs text-gray-400">{formData.compania.length} / 30</div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Número</label>
                        <input
                            type="text"
                            name="numero"
                            value={formData.numero}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                        />
                        <div className="text-right text-xs text-gray-400">{formData.numero.length} / 10</div>
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

export default NumeroTelefonicoEditModal;