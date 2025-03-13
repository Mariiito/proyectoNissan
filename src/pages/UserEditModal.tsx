import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

interface UserEditModalProps {
  usuario: Usuario | null;
  onClose: () => void;
  onSave: (updatedUser: Usuario) => void;
  isOpen: boolean;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ usuario, onClose, onSave, isOpen }) => {
  const [formData, setFormData] = useState<Usuario | null>(null);

  useEffect(() => {
    if (usuario) {
      setFormData({ ...usuario });
    }
  }, [usuario]);

  if (!isOpen || !formData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      if (!prev) return prev;
      
      if (type === 'checkbox') {
        return {
          ...prev,
          [name]: (e.target as HTMLInputElement).checked
        };
      }
      
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleRadioChange = (name: string, value: boolean) => {
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
          <h2 className="text-lg font-semibold">Editar datos de {formData.email}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimesCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              <div className="text-right text-xs text-gray-400">{formData.username.length}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              <div className="text-right text-xs text-gray-400">{formData.email.length}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nombres</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              <div className="text-right text-xs text-gray-400">{formData.first_name.length}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Apellidos</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              <div className="text-right text-xs text-gray-400">{formData.last_name.length}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Ingrese datos por favor"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              <div className="text-right text-xs text-gray-400">0</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Admin</label>
              <div className="flex mt-2">
                <div 
                  className={`flex-1 text-center py-1 cursor-pointer ${formData.is_superuser ? 'bg-green-500' : 'bg-gray-700 border-r border-gray-600'}`}
                  onClick={() => handleRadioChange('is_superuser', true)}
                >
                  Sí
                </div>
                <div 
                  className={`flex-1 text-center py-1 cursor-pointer ${!formData.is_superuser ? 'bg-green-500' : 'bg-gray-700'}`}
                  onClick={() => handleRadioChange('is_superuser', false)}
                >
                  No
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Activo</label>
              <div className="flex mt-2">
                <div 
                  className={`flex-1 text-center py-1 cursor-pointer ${formData.is_active ? 'bg-green-500' : 'bg-gray-700 border-r border-gray-600'}`}
                  onClick={() => handleRadioChange('is_active', true)}
                >
                  Sí
                </div>
                <div 
                  className={`flex-1 text-center py-1 cursor-pointer ${!formData.is_active ? 'bg-green-500' : 'bg-gray-700'}`}
                  onClick={() => handleRadioChange('is_active', false)}
                >
                  No
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Superusuario</label>
              <div className="flex mt-2">
                <div 
                  className={`flex-1 text-center py-1 cursor-pointer ${formData.is_superuser ? 'bg-green-500' : 'bg-gray-700 border-r border-gray-600'}`}
                  onClick={() => handleRadioChange('is_superuser', true)}
                >
                  Sí
                </div>
                <div 
                  className={`flex-1 text-center py-1 cursor-pointer ${!formData.is_superuser ? 'bg-green-500' : 'bg-gray-700'}`}
                  onClick={() => handleRadioChange('is_superuser', false)}
                >
                  No
                </div>
              </div>
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

export default UserEditModal;