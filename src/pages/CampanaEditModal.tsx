// CampanaEditModal.tsx
import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

interface CampanaData {
  ID: number;
  Nombre: string;
  Descripción: string;
  Subcuenta: string;
  CredencialTwilio: string;
  CredencialGcp: string;
  Plantillas: number;
  Sheets: number;
  Creado: string;
  Actualizado: string;
}

interface Subcuenta {
  id: number;
  Nombre: string;
}

interface Credencial {
  id: number;
  name: string;
}

interface Template {
  id: number;
  name: string;
  associated_fields: string;
  sid: string;
  created_at: string;
  updated_at: string;
  campaign_id: number;
}

interface Sheet {
  id: number;
  sheet_id: string;
  sheet_sheet: string;
  sheet_range: string;
  field_blacklist: string;
  field_status: string;
  field_contact: string;
  created_at: string;
  updated_at: string;
  campaign_id: number;
}

interface CampanaEditModalProps {
  campana: CampanaData | null;
  onClose: () => void;
  onSave: (updatedCampana: CampanaEditData) => void;
  isOpen: boolean;
  subcuentas: Subcuenta[];
  credenciales: Credencial[];
}

// Interfaz para los datos que se enviarán al servidor
interface CampanaEditData {
  id: number;
  name: string;
  description: string;
  sub_account_id: number;
  credential_twilio_id: number;
  credential_gcp_id: number;
}

const CampanaEditModal: React.FC<CampanaEditModalProps> = ({ 
  campana, 
  onClose, 
  onSave, 
  isOpen, 
  subcuentas, 
  credenciales 
}) => {
  const [formData, setFormData] = useState<CampanaEditData | null>(null);
  const [templateData, setTemplateData] = useState<Template | null>(null);
  const [sheetData, setSheetData] = useState<Sheet | null>(null);
  
  useEffect(() => {
    if (campana) {
      setFormData({
        id: campana.ID,
        name: campana.Nombre,
        description: campana.Descripción,
        sub_account_id: parseInt(campana.Subcuenta),
        credential_twilio_id: parseInt(campana.CredencialTwilio || '0'),
        credential_gcp_id: parseInt(campana.CredencialGcp || '0')
      });

      // Cargar datos de plantillas
      const fetchTemplates = async () => {
        try {
          const response = await fetch(`http://localhost:3001/templates_by_campaign/${campana.ID}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setTemplateData(data[0]);
            }
          } else {
            console.error('Error al obtener plantillas');
          }
        } catch (error) {
          console.error('Error al cargar plantillas:', error);
        }
      };

      // Cargar datos de hojas
      const fetchSheets = async () => {
        try {
          const response = await fetch(`http://localhost:3001/sheets_by_campaign/${campana.ID}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setSheetData(data[0]);
            }
          } else {
            console.error('Error al obtener hojas');
          }
        } catch (error) {
          console.error('Error al cargar hojas:', error);
        }
      };

      fetchTemplates();
      fetchSheets();
    }
  }, [campana]);

  if (!isOpen || !formData || !campana) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        [name]: name === 'sub_account_id' || name === 'credential_twilio_id' || name === 'credential_gcp_id' 
          ? parseInt(value) 
          : value
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  // Estilos personalizados para los selects
  const selectStyle = {
    color: 'white',
    fontWeight: 'normal' as 'normal',
    backgroundColor: '#4A5568'
  };

  // Formatear JSON para mostrar en textareas
  const formatTemplateData = () => {
    if (!templateData) return "";
    
    try {
      const templateObj = {
        id: templateData.id,
        name: templateData.name,
        associated_fields: templateData.associated_fields,
        sid: templateData.sid,
        created_at: templateData.created_at,
        updated_at: templateData.updated_at
      };
      
      return JSON.stringify(templateObj, null, 2);
    } catch (e) {
      console.error("Error al formatear datos de plantilla:", e);
      return "";
    }
  };
  
  const formatSheetData = () => {
    if (!sheetData) return "";
    
    try {
      const sheetObj = {
        id: sheetData.id,
        sheet_id: sheetData.sheet_id,
        sheet_sheet: sheetData.sheet_sheet,
        sheet_range: sheetData.sheet_range,
        field_blacklist: sheetData.field_blacklist,
        field_status: sheetData.field_status,
        field_contact: sheetData.field_contact,
        created_at: sheetData.created_at,
        updated_at: sheetData.updated_at
      };
      
      return JSON.stringify(sheetObj, null, 2);
    } catch (e) {
      console.error("Error al formatear datos de hoja:", e);
      return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-md shadow-lg w-full max-w-5xl relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Editar datos de {campana.Nombre}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimesCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subcuenta</label>
              <select
                name="sub_account_id"
                value={formData.sub_account_id}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                style={selectStyle}
              >
                {subcuentas.map(subcuenta => (
                  <option key={subcuenta.id} value={subcuenta.id}>
                    {subcuenta.Nombre}
                  </option>
                ))}
              </select>
            </div>
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
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white resize-y"
            />
            <div className="text-right text-xs text-gray-400">{formData.description ? formData.description.length : 0} / 200</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Credencial Twilio</label>
              <select
                name="credential_twilio_id"
                value={formData.credential_twilio_id}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                style={selectStyle}
              >
                {credenciales
                  .filter(cred => cred.name.toLowerCase().includes('twilio') || cred.name === '')
                  .map(credencial => (
                    <option key={credencial.id} value={credencial.id}>
                      {credencial.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Credencial GCP</label>
              <select
                name="credential_gcp_id"
                value={formData.credential_gcp_id}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                style={selectStyle}
              >
                {credenciales
                  .filter(cred => cred.name.toLowerCase().includes('gcp') || cred.name === '')
                  .map(credencial => (
                    <option key={credencial.id} value={credencial.id}>
                      {credencial.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Plantillas</label>
              <textarea
                value={formatTemplateData()}
                disabled
                rows={8}
                className="w-full p-2 bg-gray-600 border border-gray-600 rounded text-white cursor-not-allowed resize-y"
              />
              <div className="text-xs text-gray-400 mt-1">Número de plantillas (no editable)</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sheets</label>
              <textarea
                value={formatSheetData()}
                disabled
                rows={8}
                className="w-full p-2 bg-gray-600 border border-gray-600 rounded text-white cursor-not-allowed resize-y"
              />
              <div className="text-xs text-gray-400 mt-1">Número de hojas (no editable)</div>
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

export default CampanaEditModal;