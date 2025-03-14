// CredencialEditModal.tsx
import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

interface Credencial {
    id: number;
    name: string;
    json: string;
    created_at: string;
    updated_at: string;
}

interface CredencialEditModalProps {
    credencial: Credencial | null;
    onClose: () => void;
    onSave: (updatedCredencial: Credencial) => void;
    isOpen: boolean;
}

const CredencialEditModal: React.FC<CredencialEditModalProps> = ({ credencial, onClose, onSave, isOpen }) => {
    const [formData, setFormData] = useState<Credencial | null>(null);

    useEffect(() => {
        if (credencial) {
            setFormData({ ...credencial });
        }
    }, [credencial]);

    if (!isOpen || !formData) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const textareaRows = () => {
        if (formData && formData.json) {
            // Calcular el número de líneas aproximado basado en el contenido
            // Como mínimo 5 filas
            return Math.max(5, (formData.json.match(/\n/g) || []).length + 2);
        }
        return 5;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white rounded-md shadow-lg w-full max-w-3xl relative">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold">Editar datos de {formData.name}</h2>
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
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                            />
                            <div className="text-right text-xs text-gray-400">{formData.name.length} / 50</div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Credencial</label>
                        <textarea
                            name="json"
                            value={formData.json}
                            onChange={handleInputChange}
                            rows={textareaRows()}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white resize-y"
                        />
                        <div className="text-right text-xs text-gray-400">{formData.json.length}</div>
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

export default CredencialEditModal;