import React, { useState, useRef, useEffect } from 'react';
import { FaPencilAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Interfaces
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

interface Subcuenta {
  id: number;
  usuario: number;
  nombre: string;
  creado: string;
  actualizado: string;
}

interface Campana {
  id: number;
  nombre: string;
  descripcion: string;
  subcuenta: number;
  credencialTwilio: number;
  credencialGcp: number;
  plantillas: number;
  sheets: number;
  creado: string;
  actualizado: string;
}

interface NumeroTelefonico {
  id: number;
  nombre: string;
  compania: string;
  numero: string;
  creado: string;
  actualizado: string;
}

interface Credencial {
  id: number;
  name: string;
  json: string;
  created_at: string;
  updated_at: string;
}

interface CampanaForm {
  nombre: string;
  descripcion: string;
  usuario: string;
  subcuenta: number | null;
}

// Nueva interface para Asociar Campos
interface AsociarCamposForm {
  usuario: string;
  subcuenta: number | null;
  campana: number | null;
  sheetId: string;
  hoja: string;
  rango: string;
}

interface CampaignData {
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

interface NumberPhoneData {
  id: number;
  nombre: string;
  compania: string;
  numero: string;
  creado: string;
  actualizado: string;
}

interface SubcuentasData {
  id: number;
  Usuario: number;
  Nombre: string;
  Creado: string;
  Actualizado: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();

  // Estados
  const [subcuentas] = useState<Subcuenta[]>([
    { id: 10, usuario: 1, nombre: 'Subcuenta Principal', creado: '11/2/2025, 10:31:31', actualizado: '11/2/2025, 10:31:31' },
    { id: 11, usuario: 3, nombre: 'PruebaHuerpi', creado: '21/2/2025, 10:57:28', actualizado: '21/2/2025, 10:57:28' },
    { id: 12, usuario: 5, nombre: 'Pruebas', creado: '25/2/2025, 10:47:35', actualizado: '25/2/2025, 10:47:35' },
    { id: 13, usuario: 6, nombre: 'Posventa-Masivos', creado: '27/2/2025, 10:32:54', actualizado: '27/2/2025, 10:32:54' }
  ]);
  const [listaNumerosTelefonicos] = useState<NumeroTelefonico[]>([
    { id: 7, nombre: 'Gasme Posventa', compania: 'Desconocido', numero: '+52 2711330327', creado: '27/2/2025, 10:28:44', actualizado: '27/2/2025, 10:45:22' },
    { id: 6, nombre: 'Prueba-Ramos', compania: 'Prueba', numero: '+52 6623254234', creado: '25/2/2025, 10:44:00', actualizado: '25/2/2025, 10:44:00' },

    { id: 5, nombre: 'Grupo Huerpel Posventa', compania: 'Desconocido', numero: '+52 0', creado: '20/2/2025, 17:55:42', actualizado: '21/2/2025, 10:11:56' },
    { id: 4, nombre: 'No', compania: 'Gerente BDC Posventa', numero: '+52 0', creado: '20/2/2025, 17:29:03', actualizado: '21/2/2025, 10:11:51' },
    { id: 3, nombre: 'Huerpel-wap', compania: 'Gerente BDC Posventa', numero: '+52 2211830913', creado: '20/2/2025, 17:05:20', actualizado: '21/2/2025, 10:12:06' },
    { id: 2, nombre: 'Nissan Grupo Granauto Sonora', compania: 'Desconocido', numero: '+52 6624216955', creado: '11/2/2025, 10:32:14', actualizado: '11/2/2025, 10:32:14' },
    { id: 1, nombre: 'Grupo Granauto', compania: 'Desconocido', numero: '+52 6622822820', creado: '11/2/2025, 10:32:14', actualizado: '11/2/2025, 10:32:14' }
  ]);
  const [campanas] = useState<Campana[]>([
    { id: 13, nombre: 'Masivos-Posventa', descripcion: 'Masivos posventa', subcuenta: 18, credencialTwilio: 7, credencialGcp: 1, plantillas: 1, sheets: 1, creado: '27/2/2025, 10:52:25', actualizado: '27/2/2025, 18:02:25' },
    { id: 11, nombre: 'pruebas-bdc', descripcion: 'Pruebas', subcuenta: 17, credencialTwilio: 2, credencialGcp: 1, plantillas: 1, sheets: 1, creado: '25/2/2025, 11:22:42', actualizado: '25/2/2025, 11:22:42' },
    { id: 9, nombre: 'Prueba-Huerpel', descripcion: 'Prueba para guerpel', subcuenta: 16, credencialTwilio: 5, credencialGcp: 1, plantillas: 1, sheets: 1, creado: '21/2/2025, 10:59:39', actualizado: '21/2/2025, 10:59:39' },
    { id: 1, nombre: 'Prueba Campaña', descripcion: '-', subcuenta: 1, credencialTwilio: 2, credencialGcp: 1, plantillas: 2, sheets: 1, creado: '11/2/2025, 10:33:44', actualizado: '27/2/2025, 18:04:05' }
  ]);
  const [listaCredenciales] = useState<Credencial[]>([
    { id: 1, name: 'Twilio-Victor', json: '{\n  "key": "value"\n}', created_at: '20/2/2025, 17:38:18', updated_at: '21/2/2025, 10:08:57' },
    { id: 2, name: 'Huerpi', json: '{\n  "key": "value"\n}', created_at: '20/2/2025, 17:26:57', updated_at: '20/2/2025, 17:26:57' },
  ]);

  const [tabActiva, setTabActiva] = useState('usuarios');
  const [nombreSubcuenta, setNombreSubcuenta] = useState('');
  const [email, setEmail] = useState('');
  const [nombreCredencial, setNombreCredencial] = useState('');
  const [jsonCredencial, setJsonCredencial] = useState('{\n  "key": "value"\n}');
  const [numeroTelefonicoSeleccionado, setNumeroTelefonicoSeleccionado] = useState<number>(0);
  const [subcuentaSeleccionada, setSubcuentaSeleccionada] = useState<number>(0);

  // Nuevo estado para el email del usuario
  const [userEmail, setUserEmail] = useState<string>('');

  //Nuevo Estado Asociar credenciales
  const [credencialSeleccionada, setCredencialSeleccionada] = useState<number>(0);
  const [CantidadCredenciales, setCantidadCredenciales] = useState<number>(0);

  // Estado para el formulario de campaña
  const [campanaForm, setCampanaForm] = useState<CampanaForm>({
    nombre: '',
    descripcion: '',
    usuario: '',
    subcuenta: null,
  });

  // Estados para el formulario de "Asociar Campos"
  const [asociarCamposForm, setAsociarCamposForm] = useState<AsociarCamposForm>({
    usuario: '',
    subcuenta: null,
    campana: null,
    sheetId: '',
    hoja: '',
    rango: '',
  });

  const [campaignsData, setCampaignsData] = useState<CampaignData[]>([]);

  const [numberPhonesData, setNumberPhonesData] = useState<NumberPhoneData[]>([]);

  const [subcuentasData, setSubcuentasData] = useState<SubcuentasData[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [credentials, setCredentials] = useState<Credencial[]>([]);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Efectos
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = '{\n  "key": "value"\n}';
    }
  }, [tabActiva]);

  // Efecto para obtener el email del usuario al montar el componente
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch('http://localhost:3001/user-email');
        console.log("Respuesta del backend:", response); // Agrega este console.log
        if (response.ok) {
          const data = await response.json();
          console.log("Datos del backend:", data); // Agrega este console.log
          setUserEmail(data.email);
        } else {
          console.error('Error al obtener el email del usuario:', response.status);
        }
      } catch (error) {
        console.error('Error al obtener el email del usuario:', error);
      }
    };

    fetchUserEmail();
  }, []);

  // Función para obtener las campañas desde el backend
  const fetchCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:3001/campaigns');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCampaignsData(data);
    } catch (error) {
      console.error("Could not fetch campaigns:", error);
    }
  };
useEffect(() => {
    const fetchSubcuentas = async () => {
      try {
        const response = await fetch('http://localhost:3001/sub_accounts'); // Ajusta la URL si es necesario
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubcuentasData(data);
      } catch (error) {
        console.error("Could not fetch subcuentas:", error);
      }
    };

    if (tabActiva === 'subcuentas-tab') {
      fetchSubcuentas();
    }
  }, [tabActiva]);
  useEffect(() => {
    const fetchNumberPhones = async () => {
      try {
        const response = await fetch('http://localhost:3001/number_phones');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNumberPhonesData(data);
      } catch (error) {
        console.error("Could not fetch number phones:", error);
      }
    };

    if (tabActiva === 'numeros-tab') {
      fetchNumberPhones();
    }
  }, [tabActiva]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Could not fetch users:", error);
      }
    };

    if (tabActiva === 'usuarios') {
      fetchUsers();
    }
  }, [tabActiva]);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await fetch('http://localhost:3001/credentials');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCredentials(data);
      } catch (error) {
        console.error("Could not fetch credentials:", error);
      }
    };

    if (tabActiva === 'credenciales-tab') {
      fetchCredentials();
    }
  }, [tabActiva]);
  // Handlers
  const handleLogout = () => {
    navigate('/');
  };
  // Función para el botón "Buscar"
  const handleBuscarUsuario = () => {
    console.log("handleBuscarUsuario ejecutado"); // Agrega este console.log
    console.log('userEmail:', userEmail); // Agrega este console.log
    setEmail(userEmail);
    console.log('email:', email); // Agrega este console.log
  };

  const handleCreateSubcuenta = () => {
    alert(`Creando subcuenta: ${nombreSubcuenta} para el usuario: ${email}`);
  };

  const handleCrearCredencial = () => {
    alert(`Creando credencial con nombre: ${nombreCredencial} y JSON: ${jsonCredencial}`);
  };

  const handleAsociarNumeros = () => {
    alert(`Asociando el número ${numeroTelefonicoSeleccionado} a la subcuenta ${subcuentaSeleccionada}`);
  };
  const handleAsociarCredenciales = () => {
    alert(`Asociando la credencial ${credencialSeleccionada} a la subcuenta ${subcuentaSeleccionada}`);
  };
const handleDecrementarCredenciales = () => {
    setCantidadCredenciales(CantidadCredenciales > 0 ? CantidadCredenciales - 1 : 0);
  };

const handleIncrementarCredenciales = () => {
    setCantidadCredenciales(CantidadCredenciales + 1);
  };

  // Handler para el formulario de campaña
  const handleCampanaFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampanaForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCampanaFormSubmit = () => {
    // Aquí puedes hacer algo con los datos del formulario, como enviarlos a un servidor.
    alert(`Creando campaña con nombre: ${campanaForm.nombre}, descripción: ${campanaForm.descripcion}, usuario: ${campanaForm.usuario}, subcuenta: ${campanaForm.subcuenta}`);
  };

  // Handler para el formulario de "Asociar Campos"
  const handleAsociarCamposChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAsociarCamposForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const handleAsociarCamposSubmit = () => {
    // Aquí puedes hacer algo con los datos del formulario, como enviarlos a un servidor.
    alert(`Asociando campos: ${JSON.stringify(asociarCamposForm)}`);
  };

  // Options para Selects
  const subcuentasOptions = subcuentas.map(subcuenta => (
    <option
      key={subcuenta.id}
      value={subcuenta.id}
      style={{ color: 'black', fontWeight: 'bold' }}
    >
      {subcuenta.nombre}
    </option>
  ));
  const numerosTelefonicosOptions = listaNumerosTelefonicos.map(numero => (
    <option key={numero.id} value={numero.id} style={{ color: 'black' }}>
      {numero.numero} - {numero.nombre}
    </option>
  ));

  const credencialesOptions = listaCredenciales.map(credencial => (
    <option key={credencial.id} value={credencial.id} style={{ color: 'black' }}>
      {credencial.name}
    </option>
  ));

  // Obtenemos las opciones de campañas (necesario para el select de campañas)
  const campanasOptions = campanas.map(campana => (
    <option
      key={campana.id}
      value={campana.id}
      style={{ color: 'black', fontWeight: 'bold' }}
    >
      {campana.nombre}
    </option>
  ));

  function handleDecrementarNumeros(): void {
    throw new Error('Function not implemented.');
  }

  // Estilos personalizados para los selects
  const selectStyle = {
    color: 'black',
    fontWeight: 'bold' as 'bold',
    backgroundColor: 'white'
  };
  // Renderizado
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#673ab7] text-white px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Panel administrativo</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={handleLogout}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </header>

      {/* Navegación */}
      <nav className="flex overflow-x-auto bg-gray-900 text-white">
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'subcuentas' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => setTabActiva('subcuentas')}>Subcuentas</button>
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'numeros' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => setTabActiva('numeros')}>Números telefónicos</button>
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'credenciales' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => setTabActiva('credenciales')}>Credenciales</button>
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'asociar-numeros' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => setTabActiva('asociar-numeros')}>Asociar números telefónicos</button>
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'asociar-credenciales' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => setTabActiva('asociar-credenciales')}>Asociar credenciales</button>
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'crear-campana' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => setTabActiva('crear-campana')}>Crear campaña</button>
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'asociar-campos' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => setTabActiva('asociar-campos')}>Asociar campos</button>
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'usuarios' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => setTabActiva('usuarios')}>Usuarios</button>
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'subcuentas-tab' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => setTabActiva('subcuentas-tab')}>Subcuentas</button>
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'numeros-tab' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => setTabActiva('numeros-tab')}>Números telefónicos</button>
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'credenciales-tab' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => setTabActiva('credenciales-tab')}>Credenciales</button>
        <button className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'campanas' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} onClick={() => { setTabActiva('campanas'); fetchCampaigns(); }}>Campañas</button>
      </nav>
      {/* Contenido principal */}
      <main className="flex-1 p-6 overflow-auto">
        {tabActiva === 'subcuentas' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear subcuenta</h2>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Usuario</label>
              <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded mb-2" />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black" onClick={handleBuscarUsuario}>Buscar</button>
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Lista de usuarios</button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Nombre de la subcuenta</label>
              <input type="text" placeholder="Nombre de la subcuenta" value={nombreSubcuenta} onChange={(e) => setNombreSubcuenta(e.target.value)} className="w-full p-2 border border-gray-300 rounded mb-1" />
              <div className="text-right text-sm text-gray-500">0 / 50</div>
            </div>
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]" onClick={handleCreateSubcuenta}>
                Crear subcuenta <FaPencilAlt />
              </button>
            </div>
          </div>
        )}
  {tabActiva === 'usuarios' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-black">ID</th>
                  <th className="py-3 px-4 text-left font-medium text-black">USUARIO</th>
                  <th className="py-3 px-4 text-left font-medium text-black">EMAIL</th>
                  <th className="py-3 px-4 text-left font-medium text-black">NOMBRE</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ADMIN</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ACTIVO</th>
                  <th className="py-3 px-4 text-left font-medium text-black">CREACIÓN</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ÚLTIMO LOGIN</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuarios.map(usuario => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{usuario.id}</td>
                    <td className="py-3 px-4 text-black">{usuario.username}</td>
                    <td className="py-3 px-4">
                      <div className="text-black">{usuario.email}</div>
                    </td>
                    <td className="py-3 px-4 text-black">{usuario.first_name} {usuario.last_name}</td>
                    <td className="py-3 px-4 text-black">{usuario.is_superuser ? 'SI' : 'NO'}</td>
                    <td className="py-3 px-4 text-black">{usuario.is_active ? 'SI' : 'NO'}</td>
                    <td className="py-3 px-4 text-black">{usuario.date_joined}</td>
                    <td className="py-3 px-4 text-black">{usuario.last_login}</td>
                    <td className="py-3 px-4">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4 gap-2">
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Anterior</button>
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Siguiente</button>
            </div>
          </div>
        )}
        {tabActiva === 'subcuentas-tab' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-black">ID</th>
                  <th className="py-3 px-4 text-left font-medium text-black">Usuario</th>
                  <th className="py-3 px-4 text-left font-medium text-black">Nombre</th>
                  <th className="py-3 px-4 text-left font-medium text-black">Creado</th>
                  <th className="py-3 px-4 text-left font-medium text-black">Actualizado</th>
                  <th className="py-3 px-4 text-left font-medium text-black">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subcuentasData.map(subcuenta => (
                  <tr key={subcuenta.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{subcuenta.id}</td>
                    <td className="py-3 px-4 text-black">{subcuenta.Usuario}</td>
                    <td className="py-3 px-4 text-black">{subcuenta.Nombre}</td>
                    <td className="py-3 px-4 text-black">{subcuenta.Creado}</td>
                    <td className="py-3 px-4 text-black">{subcuenta.Actualizado}</td>
                    <td className="py-3 px-4">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4 gap-2">
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Anterior</button>
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Siguiente</button>
            </div>
          </div>
        )}
 {tabActiva === 'campanas' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-black">ID</th>
                  <th className="py-3 px-4 text-left font-medium text-black">NOMBRE</th>
                  <th className="py-3 px-4 text-left font-medium text-black">DESCRIPCIÓN</th>
                  <th className="py-3 px-4 text-left font-medium text-black">SUBCUENTA</th>
                  <th className="py-3 px-4 text-left font-medium text-black">CREDENCIAL TWILIO</th>
                  <th className="py-3 px-4 text-left font-medium text-black">CREDENCIAL GCP</th>
                  <th className="py-3 px-4 text-left font-medium text-black">PLANTILLAS</th>
                  <th className="py-3 px-4 text-left font-medium text-black">SHEETS</th>
                  <th className="py-3 px-4 text-left font-medium text-black">CREADO</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ACTUALIZADO</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {campaignsData.map(campana => (
                  <tr key={campana.ID} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{campana.ID}</td>
                    <td className="py-3 px-4 text-black">{campana.Nombre}</td>
                    <td className="py-3 px-4 text-black">{campana.Descripción}</td>
                    <td className="py-3 px-4 text-black">{campana.Subcuenta}</td>
                    <td className="py-3 px-4 text-black">{campana.CredencialTwilio}</td>
                    <td className="py-3 px-4 text-black">{campana.CredencialGcp}</td>
                    <td className="py-3 px-4 text-black">{campana.Plantillas}</td>
                    <td className="py-3 px-4 text-black">{campana.Sheets}</td>
                    <td className="py-3 px-4 text-black">{campana.Creado}</td>
                    <td className="py-3 px-4 text-black">{campana.Actualizado}</td>
                    <td className="py-3 px-4">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4 gap-2">
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Anterior</button>
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Siguiente</button>
            </div>
          </div>
        )}
        {tabActiva === 'numeros' && (<div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear números telefónicos</h2>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-1">Número de teléfono</label>
            <input type="text" placeholder="Número de teléfono" className="w-full p-2 border border-gray-300 rounded mb-2" />
            <div className="text-right text-sm text-gray-500">0 / 10</div>
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" placeholder="Nombre" className="w-full p-2 border border-gray-300 rounded mb-2" />
            <div className="text-right text-sm text-gray-500">0 / 30</div>
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-1">Operador</label>
            <input type="text" placeholder="Operador" className="w-full p-2 border border-gray-300 rounded mb-2" />
            <div className="text-right text-sm text-gray-500">0 / 30</div>
          </div>
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]">Crear números telefónicos <FaPencilAlt /></button>
          </div>
        </div>
        )}
 {tabActiva === 'numeros-tab' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-black">ID</th>
                  <th className="py-3 px-4 text-left font-medium text-black">NOMBRE</th>
                  <th className="py-3 px-4 text-left font-medium text-black">COMPAÑÍA</th>
                  <th className="py-3 px-4 text-left font-medium text-black">NÚMERO</th>
                  <th className="py-3 px-4 text-left font-medium text-black">CREADO</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ACTUALIZADO</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {numberPhonesData.map(numero => (
                  <tr key={numero.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{numero.id}</td>
                    <td className="py-3 px-4 text-black">{numero.nombre}</td>
                    <td className="py-3 px-4 text-black">{numero.compania}</td>
                    <td className="py-3 px-4 text-black">{numero.numero}</td>
                    <td className="py-3 px-4 text-black">{numero.creado}</td>
                    <td className="py-3 px-4 text-black">{numero.actualizado}</td>
                    <td className="py-3 px-4">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4 gap-2">
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Anterior</button>
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Siguiente</button>
            </div>
          </div>
        )}
        {tabActiva === 'credenciales-tab' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-black">ID</th>
                  <th className="py-3 px-4 text-left font-medium text-black">NOMBRE</th>
                  <th className="py-3 px-4 text-left font-medium text-black">JSON</th>
                  <th className="py-3 px-4 text-left font-medium text-black">CREADO</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ACTUALIZADO</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {credentials.map(credencial => (
                  <tr key={credencial.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{credencial.id}</td>
                    <td className="py-3 px-4 text-black">{credencial.name}</td>
                    <td className="py-3 px-4 text-black"><button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Ver</button></td>
                    <td className="py-3 px-4 text-black">{credencial.created_at}</td>
                    <td className="py-3 px-4 text-black">{credencial.updated_at}</td>
                    <td className="py-3 px-4">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4 gap-2">
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Anterior</button>
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Siguiente</button>
            </div>
          </div>
        )}
        {tabActiva === 'credenciales' && (<div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear credenciales</h2>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-1">Nombre de la credencial</label>
            <input
              type="text"
              placeholder="Nombre"
              value={nombreCredencial}
              onChange={(e) => setNombreCredencial(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <div className="text-right text-sm text-gray-500">{nombreCredencial.length} / 50</div>
          </div>
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-1">Credencial en formato JSON</label>
            <textarea
              ref={textareaRef}
              value={jsonCredencial}
              onChange={(e) => setJsonCredencial(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2 h-40 text-black"
            />
            <div className="text-right text-sm text-gray-500">{jsonCredencial.length}</div>
          </div>
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
              onClick={handleCrearCredencial}
            >
              Crear credencial <FaPencilAlt />
            </button>
          </div>
        </div>
        )}
 {tabActiva === 'asociar-numeros' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Asociar números telefónicos</h2>

            {/* Usuario */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Buscar</button>
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Lista de usuarios</button>
              </div>
            </div>

            {/* Subcuenta */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Subcuenta</label>
              <select
                value={subcuentaSeleccionada}
                onChange={(e) => setSubcuentaSeleccionada(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
                style={selectStyle}
              >
                <option value={0} style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar compañia</option>
                {subcuentasOptions}
              </select>
            </div>

            {/* Numero Telefonico */}
            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Numero telefonico</label>
              <select
                value={numeroTelefonicoSeleccionado}
                onChange={(e) => setNumeroTelefonicoSeleccionado(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
                style={selectStyle}
              >
                <option value={0} style={{ color: 'black', fontWeight: 'bold' }}>0</option>
                {numerosTelefonicosOptions}
              </select>
            </div>
            {/* Cantidad de números */}
            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Cantidad de números</label>
              <div className="flex items-center">
                <select
                  value={numeroTelefonicoSeleccionado}
                  onChange={(e) => setNumeroTelefonicoSeleccionado(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={selectStyle}
                >
                  <option value={0} style={{ color: 'black', fontWeight: 'bold' }}>0</option>
                  {numerosTelefonicosOptions}
                </select>
                <button
                  className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                  onClick={handleDecrementarNumeros}
                >
                  +
                </button>
                <button
                  className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                  onClick={handleDecrementarNumeros}
                >
                  -
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
                onClick={handleAsociarNumeros}
              >
                Asociar números telefónicos <FaPencilAlt />
              </button>
            </div>
          </div>
        )}
        {tabActiva === 'asociar-credenciales' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Asociar Credenciales</h2>

            {/* Usuario */}
            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Buscar</button>
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Lista de usuarios</button>
              </div>
            </div>

            {/* Subcuenta */}
            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Subcuenta</label>
              <select
                value={subcuentaSeleccionada}
                onChange={(e) => setSubcuentaSeleccionada(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
                style={selectStyle}
              >
                <option value={0} style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar compañia</option>
                {subcuentasOptions}
              </select>
            </div>
            {/* Credenciales */}
            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Credenciales</label>
              <select
                value={credencialSeleccionada}
                onChange={(e) => setCredencialSeleccionada(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
                style={selectStyle}
              >
                <option value={0} style={{ color: 'black', fontWeight: 'bold' }}>0</option>
                {credencialesOptions}
              </select>
            </div>

            {/* Cantidad de Credenciales */}
            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Cantidad de Credenciales</label>
              <div className="flex items-center">
                <select
                  value={credencialSeleccionada}
                  onChange={(e) => setCredencialSeleccionada(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={selectStyle}
                >
                  <option value={0} style={{ color: 'black', fontWeight: 'bold' }}>0</option>
                  {credencialesOptions}
                </select>
                <button
                  className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                  onClick={handleIncrementarCredenciales}
                >
                  +
                </button>
                <button
                  className="px-2 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                  onClick={handleDecrementarCredenciales}
                >
                  -
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
                onClick={handleAsociarCredenciales}
              >
                Asociar credenciales <FaPencilAlt />
              </button>
            </div>
          </div>
        )}
        {tabActiva === 'crear-campana' && (

          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Campaña</h2>
            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre de la campaña"
                value={campanaForm.nombre}
                onChange={handleCampanaFormChange}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
            </div>
            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={3}
                placeholder="Descripción de la campaña"
                value={campanaForm.descripcion}
                onChange={handleCampanaFormChange}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
            </div>
            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="email"
                id="usuario"
                name="usuario"
                placeholder="Correo del usuario"
                value={campanaForm.usuario}
                onChange={handleCampanaFormChange}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">
                  Buscar</button>
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Lista de usuarios</button>
              </div>
            </div>
            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Subcuenta</label>
              <select
                id="subcuenta"
                name="subcuenta"
                value={campanaForm.subcuenta || ''}
                onChange={(e) => setCampanaForm((prevForm) => ({ ...prevForm, subcuenta: Number(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded"
                style={selectStyle}
              >
                <option value="" style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar subcuenta</option>
                {subcuentasOptions}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
                onClick={handleCampanaFormSubmit}
              >
                Guardar campaña <FaPencilAlt />
              </button>
            </div>
          </div>

        )}
        {tabActiva === 'asociar-campos' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Asociar Campos</h2>

            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="email"
                name="usuario"
                placeholder="Correo"
                value={asociarCamposForm.usuario}
                onChange={handleAsociarCamposChange}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Buscar</button>
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Lista de usuarios</button>
              </div>
            </div>

            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Subcuenta</label>
              <select
                name="subcuenta"
                value={asociarCamposForm.subcuenta || ''}
                onChange={handleAsociarCamposChange}
                className="w-full p-2 border border-gray-300 rounded"
                style={selectStyle}
              >
                <option value="" style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar subcuenta</option>
                {subcuentasOptions}
              </select>
            </div>

            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Campaña</label>
              <select
                name="campana"
                value={asociarCamposForm.campana || ''}
                onChange={handleAsociarCamposChange}
                className="w-full p-2 border border-gray-300 rounded"
                style={selectStyle}
              >
                <option value="" style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar campaña</option>
                {campanasOptions}
              </select>
            </div>

            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Sheet ID</label>
              <input
                type="text"
                name="sheetId"
                placeholder="ID de la hoja de cálculo"
                value={asociarCamposForm.sheetId}
                onChange={handleAsociarCamposChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Hoja</label>
              <input
                type="text"
                name="hoja"
                placeholder="Nombre de la hoja"
                value={asociarCamposForm.hoja}
                onChange={handleAsociarCamposChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-6">
              <label  className="block font-medium text-gray-700 mb-1">Rango</label>
              <input
                type="text"
                name="rango"
                placeholder="Rango de celdas"
                value={asociarCamposForm.rango}
                onChange={handleAsociarCamposChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]" onClick={handleAsociarCamposSubmit}>
                Guardar Asociaciones <FaPencilAlt />
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="flex justify-between items-center bg-gray-900 text-white px-4 py-2">
        <div>2025</div>
        <div>AUTO INSIGHTS</div>
      </footer>
    </div>
  );
};

export default Admin;