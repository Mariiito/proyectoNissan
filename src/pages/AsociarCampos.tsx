import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaSync, FaSearch, FaEye, FaEyeSlash, } from 'react-icons/fa';

// Props que recibe el componente desde Admin
interface AsociarCamposProps {
  email: string;
  setEmail: (email: string) => void;
  handleBuscarUsuario: () => void;
  userSubcuentas: any[];
  setMensaje: (mensaje: { texto: string, tipo: 'exito' | 'error' | '' }) => void;
}

const AsociarCampos: React.FC<AsociarCamposProps> = ({
  email,
  setEmail,
  handleBuscarUsuario,
  userSubcuentas,
  setMensaje
}) => {
  // Estados internos del componente
  const [subcuentaSeleccionada, setSubcuentaSeleccionada] = useState<number | null>(null);
  const [campanas, setCampanas] = useState<any[]>([]);
  const [campanaSeleccionada, setCampanaSeleccionada] = useState<number | null>(null);
  const [sheets, setSheets] = useState<any[]>([]);
  const [sheetSeleccionado, setSheetSeleccionado] = useState<number | null>(null);
  const [sheetColumnas, setSheetColumnas] = useState<string[]>([]);
  const [plantillas, setPlantillas] = useState<any[]>([]);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<number | null>(null);
  const [variablesDePlantilla, setVariablesDePlantilla] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [templatePreview, setTemplatePreview] = useState('');
  
  // Estado para mapeo de campos
  const [camposAsociados, setCamposAsociados] = useState({
    sheetId: '',
    hoja: 'Hoja 1',
    rango: 'A1:Z',
    fieldBlacklist: '', // Campo para la lista negra
    fieldStatus: '',    // Campo para el estado de WhatsApp
    fieldContact: '',   // Campo para el contacto (celular)
    variableMappings: {} as Record<string, string> // Mapeo de variables de plantilla a columnas de sheet
  });

  // Efecto para obtener campañas cuando se selecciona una subcuenta
  useEffect(() => {
    if (subcuentaSeleccionada) {
      fetchCampanasBySubcuenta();
    } else {
      setCampanas([]);
      setCampanaSeleccionada(null);
    }
  }, [subcuentaSeleccionada]);

  // Efecto para obtener sheets y plantillas cuando se selecciona una campaña
  useEffect(() => {
    if (campanaSeleccionada) {
      fetchSheetsByCampana();
      fetchPlantillasByCampana();
    } else {
      setSheets([]);
      setPlantillas([]);
      setSheetSeleccionado(null);
      setPlantillaSeleccionada(null);
    }
  }, [campanaSeleccionada]);

  // Efecto para obtener columnas de sheet cuando se selecciona uno
  useEffect(() => {
    if (sheetSeleccionado) {
      fetchSheetColumns();
    } else {
      setSheetColumnas([]);
    }
  }, [sheetSeleccionado]);

  // Efecto para obtener variables de plantilla cuando se selecciona una
  useEffect(() => {
    if (plantillaSeleccionada) {
      fetchTemplateVariables();
    } else {
      setVariablesDePlantilla({});
    }
  }, [plantillaSeleccionada]);

  // Función para obtener campañas por subcuenta
  const fetchCampanasBySubcuenta = async () => {
    try {
      setMensaje({ texto: 'Obteniendo campañas...', tipo: 'exito' });
      
      // En un entorno real, aquí harías una llamada a tu API, pero usaremos datos de ejemplo
      // const response = await fetch(`http://localhost:3001/campaigns?sub_account_id=${subcuentaSeleccionada}`);
      // const data = await response.json();
      
      // Simulamos una respuesta por ahora
      const data = [
        { ID: 1, Nombre: 'Campaña de Prueba' },
        { ID: 2, Nombre: 'Campaña de Retención' },
        { ID: 3, Nombre: 'Campaña de Servicio' }
      ];
      
      setCampanas(data);
      setMensaje({ texto: '', tipo: '' });
    } catch (error) {
      console.error('Error al obtener campañas:', error);
      setMensaje({ texto: 'Error al obtener campañas', tipo: 'error' });
    }
  };

  // Función para obtener sheets por campaña
  const fetchSheetsByCampana = async () => {
    try {
      // En un entorno real: const response = await fetch(`http://localhost:3001/sheets_by_campaign/${campanaSeleccionada}`);
      
      // Simulamos una respuesta
      const data = [
        { id: 1, sheet_id: '1AfMZ5bGZsbyLbDfRBR-pZEtEadBXIUSEUkHDCaj', sheet_sheet: 'Hoja 1', sheet_range: 'A1:Z', field_blacklist: 'Lista_Negra', field_status: 'WhatsApp', field_contact: 'Celular' }
      ];
      
      setSheets(data);
      
      if (data.length > 0) {
        const sheet = data[0];
        setSheetSeleccionado(sheet.id);
        setCamposAsociados(prev => ({
          ...prev,
          sheetId: sheet.sheet_id,
          hoja: sheet.sheet_sheet,
          rango: sheet.sheet_range,
          fieldBlacklist: sheet.field_blacklist || '',
          fieldStatus: sheet.field_status || '',
          fieldContact: sheet.field_contact || ''
        }));
      }
    } catch (error) {
      console.error('Error al obtener sheets:', error);
      setMensaje({ texto: 'Error al obtener hojas de cálculo', tipo: 'error' });
    }
  };

  // Función para obtener plantillas por campaña
  const fetchPlantillasByCampana = async () => {
    try {
      // En un entorno real: const response = await fetch(`http://localhost:3001/templates_by_campaign/${campanaSeleccionada}`);
      
      // Simulamos una respuesta
      const data = [
        { id: 1, name: 'cita_carroceria', sid: 'HX123456' }
      ];
      
      setPlantillas(data);
    } catch (error) {
      console.error('Error al obtener plantillas:', error);
      setMensaje({ texto: 'Error al obtener plantillas', tipo: 'error' });
    }
  };

  // Función para obtener columnas de un sheet
  const fetchSheetColumns = async () => {
    try {
      // En un entorno real: const response = await fetch(`http://localhost:3001/sheet_columns/${sheetSeleccionado}`);
      
      // Columnas simuladas para el ejemplo
      const columns = [
        'Lista_Negra',
        'WhatsApp',
        'Celular',
        'Nombre del Asegurado',
        'Nombre de la Aseguradora',
        'Orden',
        'Unidad',
        'No. de Serie'
      ];
      
      setSheetColumnas(columns);
    } catch (error) {
      console.error('Error al obtener columnas:', error);
      setMensaje({ texto: 'Error al obtener columnas de la hoja', tipo: 'error' });
    }
  };

  // Función para obtener variables de una plantilla
  const fetchTemplateVariables = async () => {
    try {
      // En un entorno real: const response = await fetch(`http://localhost:3001/template_fields/${plantillaSeleccionada}`);
      
      // Variables simuladas para el ejemplo
      const associated_fields = {
        "1": "Nombre del Asegurado",
        "2": "Nombre de la Aseguradora", 
        "3": "Orden",
        "4": "Unidad",
        "5": "No. de Serie"
      };
      
      setVariablesDePlantilla(associated_fields);
      
      // Inicializar el estado de mapeo de variables
      const mappings: Record<string, string> = {};
      // Convertir el objeto a Record<string, string> de forma segura
      Object.keys(associated_fields).forEach(key => {
        mappings[key] = associated_fields[key as keyof typeof associated_fields] || '';
      });
      
      setCamposAsociados(prev => ({
        ...prev,
        variableMappings: mappings
      }));
      
      // Actualizar la vista previa
      let preview = "Hola {{1}}, te escribimos de Nissan para confirmar los datos de la cita para el servicio de carrocería de tu *Nissan {{4}}* con número de serie *{{5}}*.\n\n*Aseguradora:* {{2}}\n*No. de Orden:* {{3}}";
      setTemplatePreview(preview);
    } catch (error) {
      console.error('Error al obtener variables de plantilla:', error);
      setMensaje({ texto: 'Error al obtener variables de la plantilla', tipo: 'error' });
    }
  };

  // Función para manejar los cambios en los campos de asociación básicos
  const handleCampoChange = (campo: string, valor: string) => {
    setCamposAsociados(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Función para manejar los cambios en el mapeo de variables de plantilla
  const handleVariableMappingChange = (variableKey: string, columnName: string) => {
    setCamposAsociados(prev => ({
      ...prev,
      variableMappings: {
        ...prev.variableMappings,
        [variableKey]: columnName
      }
    }));
  };

  // Función para guardar las asociaciones
  const handleGuardarAsociaciones = async () => {
    try {
      // Validaciones básicas
      if (!campanaSeleccionada || !sheetSeleccionado || !plantillaSeleccionada) {
        setMensaje({ texto: 'Debes seleccionar campaña, hoja y plantilla', tipo: 'error' });
        return;
      }

      setMensaje({ texto: 'Guardando asociaciones...', tipo: 'exito' });
      
      // En un entorno real enviarías los datos al backend
      // const response = await fetch('http://localhost:3001/associate_fields', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     campaign_id: campanaSeleccionada,
      //     sheet_id: sheetSeleccionado,
      //     template_id: plantillaSeleccionada,
      //     field_blacklist: camposAsociados.fieldBlacklist,
      //     field_status: camposAsociados.fieldStatus,
      //     field_contact: camposAsociados.fieldContact,
      //     field_mappings: camposAsociados.variableMappings
      //   }),
      // });
      
      // Simulamos éxito
      setTimeout(() => {
        setMensaje({ texto: 'Asociaciones guardadas exitosamente', tipo: 'exito' });
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
      }, 1000);
    } catch (error) {
      console.error('Error al guardar asociaciones:', error);
      setMensaje({ texto: 'Error al guardar asociaciones', tipo: 'error' });
    }
  };

  // Renderizar la vista previa de la plantilla
  const renderPlantillaPreview = () => {
    if (!showPreview || !templatePreview) return null;
    
    // Reemplazar variables con sus valores mapeados
    let previewContent = templatePreview;
    
    Object.keys(camposAsociados.variableMappings).forEach(key => {
      const pattern = new RegExp(`{{${key}}}`, 'g');
      const mappedColumn = camposAsociados.variableMappings[key];
      const value = mappedColumn ? `<${mappedColumn}>` : `<Variable ${key}>`;
      previewContent = previewContent.replace(pattern, value);
    });
    
    return (
      <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-300 text-black">
        {previewContent}
      </div>
    );
  };

  // Estilo para los selects
  const selectStyle = {
    color: 'black',
    fontWeight: 'bold' as 'bold',
    backgroundColor: 'white'
  };

  // Renderizado del componente
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Asociar campos</h2>
      
      {/* Sección Usuario y Subcuenta */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Usuario y Subcuenta</h3>
        
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-1">Usuario</label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded text-black"
            />
            <button 
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black flex items-center gap-2"
              onClick={handleBuscarUsuario}
            >
              <FaSearch /> Buscar
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-1">Subcuenta</label>
          <select
            value={subcuentaSeleccionada || ''}
            onChange={(e) => setSubcuentaSeleccionada(e.target.value ? Number(e.target.value) : null)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            style={selectStyle}
            disabled={userSubcuentas.length === 0}
          >
            <option value="">Seleccionar subcuenta</option>
            {userSubcuentas.map((subcuenta) => (
              <option key={subcuenta.id} value={subcuenta.id}>{subcuenta.Nombre}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Sección Campaña */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Campaña</h3>
        
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-1">Campaña</label>
          <select
            value={campanaSeleccionada || ''}
            onChange={(e) => setCampanaSeleccionada(e.target.value ? Number(e.target.value) : null)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            style={selectStyle}
            disabled={!subcuentaSeleccionada}
          >
            <option value="">Seleccionar campaña</option>
            {campanas.map((campana) => (
              <option key={campana.ID} value={campana.ID}>{campana.Nombre}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Sección Sheet */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Sheet</h3>
        
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-1">Sheet</label>
          <select
            value={sheetSeleccionado || ''}
            onChange={(e) => setSheetSeleccionado(e.target.value ? Number(e.target.value) : null)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            style={selectStyle}
            disabled={sheets.length === 0 || !campanaSeleccionada}
          >
            <option value="">Seleccionar sheet</option>
            {sheets.map((sheet) => (
              <option key={sheet.id} value={sheet.id}>
                {sheet.sheet_id} - {sheet.sheet_sheet}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Sheet ID</label>
            <input
              type="text"
              value={camposAsociados.sheetId}
              onChange={(e) => handleCampoChange('sheetId', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="ID de Google Sheet"
            />
          </div>
          
          <div>
            <label className="block font-medium text-gray-700 mb-1">Hoja</label>
            <input
              type="text"
              value={camposAsociados.hoja}
              onChange={(e) => handleCampoChange('hoja', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Nombre de la hoja"
            />
          </div>
          
          <div>
            <label className="block font-medium text-gray-700 mb-1">Rango</label>
            <input
              type="text"
              value={camposAsociados.rango}
              onChange={(e) => handleCampoChange('rango', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Rango de celdas (ej. A1:Z)"
            />
          </div>
        </div>

        <div className="mt-4">
          <button 
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black flex items-center gap-2"
            onClick={fetchSheetColumns}
            disabled={!sheetSeleccionado}
          >
            <FaSync /> Cargar columnas
          </button>
        </div>
      </div>
      
      {/* Sección Plantilla */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Plantilla</h3>
        
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-1">Plantilla</label>
          <select
            value={plantillaSeleccionada || ''}
            onChange={(e) => setPlantillaSeleccionada(e.target.value ? Number(e.target.value) : null)}
            className="w-full p-2 border border-gray-300 rounded text-black"
            style={selectStyle}
            disabled={plantillas.length === 0 || !campanaSeleccionada}
          >
            <option value="">Seleccionar plantilla</option>
            {plantillas.map((plantilla) => (
              <option key={plantilla.id} value={plantilla.id}>{plantilla.name}</option>
            ))}
          </select>
        </div>
        
        {/* Vista previa de la plantilla */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Vista previa de la plantilla</h3>
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
            >
              {showPreview ? <><FaEyeSlash /> Ocultar</> : <><FaEye /> Mostrar</>}
            </button>
          </div>
          
          {renderPlantillaPreview()}
        </div>
      </div>
      
      {/* Configuración de campos */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Configuración de campos</h3>
        
        {(!sheetSeleccionado || !plantillaSeleccionada) ? (
          <div className="p-4 bg-gray-100 rounded text-center">
            Selecciona una campaña, hoja y plantilla para configurar las asociaciones
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Estado (WhatsApp)</label>
                <select
                  value={camposAsociados.fieldStatus}
                  onChange={(e) => handleCampoChange('fieldStatus', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  style={selectStyle}
                >
                  <option value="">Seleccionar columna</option>
                  {sheetColumnas.map((columna) => (
                    <option key={columna} value={columna}>{columna}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-1">Lista negra</label>
                <select
                  value={camposAsociados.fieldBlacklist}
                  onChange={(e) => handleCampoChange('fieldBlacklist', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  style={selectStyle}
                >
                  <option value="">Seleccionar columna</option>
                  {sheetColumnas.map((columna) => (
                    <option key={columna} value={columna}>{columna}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block font-medium text-gray-700 mb-1">Contacto (Celular)</label>
                <select
                  value={camposAsociados.fieldContact}
                  onChange={(e) => handleCampoChange('fieldContact', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                  style={selectStyle}
                >
                  <option value="">Seleccionar columna</option>
                  {sheetColumnas.map((columna) => (
                    <option key={columna} value={columna}>{columna}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <hr className="border-t-2 border-gray-200 mb-6" />
            
            <h3 className="text-xl font-semibold mb-4 text-gray-600">Asignación de variables de plantilla</h3>
            
            {Object.keys(variablesDePlantilla).length > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                {Object.keys(variablesDePlantilla).map((key) => (
                  <div key={key} className="mb-4">
                    <label className="block font-medium text-gray-700 mb-1">
                      {key}. {variablesDePlantilla[key]}
                    </label>
                    <select
                      value={camposAsociados.variableMappings[key] || ''}
                      onChange={(e) => handleVariableMappingChange(key, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-black"
                      style={selectStyle}
                    >
                      <option value="">Seleccionar columna</option>
                      {sheetColumnas.map((columna) => (
                        <option key={columna} value={columna}>{columna}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-100 rounded text-center">
                No hay variables definidas en esta plantilla o no se ha podido obtener la información
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 px-5 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
          onClick={handleGuardarAsociaciones}
          disabled={!campanaSeleccionada || !sheetSeleccionado || !plantillaSeleccionada}
        >
          Guardar <FaPencilAlt />
        </button>
      </div>
    </div>
  );
};

export default AsociarCampos;