import React, { useState, useRef, useEffect } from 'react';
import { FaPencilAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserEditModal from './UserEditModal';
import SubcuentaEditModal from './SubcuentaEditModal';
import NumeroTelefonicoEditModal from './NumeroTelefonicoEditModal';
import CredencialEditModal from './CredencialEditModal';
import CampanaEditModal from './CampanaEditModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  usuario: number;  // Cambiar de user_id a usuario
  nombre: string;   // Cambiar de name a nombre
  creado: string;   // Cambiar de created_at a creado
  actualizado: string; // Cambiar de updated_at a actualizado
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
  subcuenta: number | null;
  credential_sheet_id: number | null;
  credential_template_id: number | null;
  credential_twilio_id: number | null;
}

// Nueva interface para Asociar Campos
interface AsociarCamposForm {
  usuario: string;
  subcuenta: number | null;
  campana: number | null;
  sheetId: string;
  hoja: string;
  rango: string;
  plantilla: string | null;
  sid: string;
  whatsapp: string;
  lista_negra: string;
  celular: string;
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

// Nueva interfaz para el formulario de números telefónicos
interface NumeroTelefonicoForm {
  numero: string;
  nombre: string;
  compania: string;
}

interface Plantilla {
  ID: number;
  Nombre: string;
  Campos: string;
  Campana: number;
  Creado: string;
  sid: string;
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

  const [_listaNumerosTelefonicos] = useState<NumeroTelefonico[]>([
    { id: 7, nombre: 'Gasme Posventa', compania: 'Desconocido', numero: '+52 2711330327', creado: '27/2/2025, 10:28:44', actualizado: '27/2/2025, 10:45:22' },
    { id: 6, nombre: 'Prueba-Ramos', compania: 'Prueba', numero: '+52 6623254234', creado: '25/2/2025, 10:44:00', actualizado: '25/2/2025, 10:44:00' },
    { id: 5, nombre: 'Grupo Huerpel Posventa', compania: 'Desconocido', numero: '+52 0', creado: '20/2/2025, 17:55:42', actualizado: '21/2/2025, 10:11:56' },
    { id: 4, nombre: 'No', compania: 'Gerente BDC Posventa', numero: '+52 0', creado: '20/2/2025, 17:29:03', actualizado: '21/2/2025, 10:11:51' },
    { id: 3, nombre: 'Huerpel-wap', compania: 'Gerente BDC Posventa', numero: '+52 2211830913', creado: '20/2/2025, 17:05:20', actualizado: '21/2/2025, 10:12:06' },
    { id: 2, nombre: 'Nissan Grupo Granauto Sonora', compania: 'Desconocido', numero: '+52 6624216955', creado: '11/2/2025, 10:32:14', actualizado: '11/2/2025, 10:32:14' },
    { id: 1, nombre: 'Grupo Granauto', compania: 'Desconocido', numero: '+52 6622822820', creado: '11/2/2025, 10:32:14', actualizado: '11/2/2025, 10:32:14' }
  ]);
  // const [campanas] = useState<Campana[]>([
  //   { id: 13, nombre: 'Masivos-Posventa', descripcion: 'Masivos posventa', subcuenta: 18, credencialTwilio: 7, credencialGcp: 1, plantillas: 1, sheets: 1, creado: '27/2/2025, 10:52:25', actualizado: '27/2/2025, 18:02:25' },
  //   { id: 11, nombre: 'pruebas-bdc', descripcion: 'Pruebas', subcuenta: 17, credencialTwilio: 2, credencialGcp: 1, plantillas: 1, sheets: 1, creado: '25/2/2025, 11:22:42', actualizado: '25/2/2025, 11:22:42' },
  //   { id: 9, nombre: 'Prueba-Huerpel', descripcion: 'Prueba para guerpel', subcuenta: 16, credencialTwilio: 5, credencialGcp: 1, plantillas: 1, sheets: 1, creado: '21/2/2025, 10:59:39', actualizado: '21/2/2025, 10:59:39' },
  //   { id: 1, nombre: 'Prueba Campaña', descripcion: '-', subcuenta: 1, credencialTwilio: 2, credencialGcp: 1, plantillas: 2, sheets: 1, creado: '11/2/2025, 10:33:44', actualizado: '27/2/2025, 18:04:05' }
  // ]);
  const [userSubcuentas, setUserSubcuentas] = useState<SubcuentasData[]>([]);
  const [campanasSubcuenta, setCampanasSubcuenta] = useState<CampaignData[]>([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [credentialAssociations, setCredentialAssociations] = useState<{ credential_id: number }[]>([{ credential_id: 0 }]);

  const [editNumeroTelefonicoModalOpen, setEditNumeroTelefonicoModalOpen] = useState(false);
  const [selectedNumeroTelefonico, setSelectedNumeroTelefonico] = useState<NumeroTelefonico | null>(null);

  const [editSubcuentaModalOpen, setEditSubcuentaModalOpen] = useState(false);
  const [selectedSubcuenta, setSelectedSubcuenta] = useState<Subcuenta | null>(null);
  // const [usuariosSelect, setUsuariosSelect] = useState<{ id: number; email: string }[]>([]);
  const [phoneAssociations, setPhoneAssociations] = useState<{ number_phone: number }[]>([{ number_phone: 0 }]);
  const [editCampanaModalOpen, setEditCampanaModalOpen] = useState(false);
  const [selectedCampana, setSelectedCampana] = useState<CampaignData | null>(null);
  const [tabActiva, setTabActiva] = useState('usuarios');
  const [nombreSubcuenta, setNombreSubcuenta] = useState('');
  const [email, setEmail] = useState('');
  const [nombreCredencial, setNombreCredencial] = useState('');
  const [jsonCredencial, setJsonCredencial] = useState('{\n  "key": "value"\n}');
  // const [numeroTelefonicoSeleccionado, setNumeroTelefonicoSeleccionado] = useState<number>(0);
  const [subcuentaSeleccionada, setSubcuentaSeleccionada] = useState<number>(0);
  const [editCredencialModalOpen, setEditCredencialModalOpen] = useState(false);
  const [selectedCredencial, setSelectedCredencial] = useState<Credencial | null>(null);

  // Validar correo electrónico
  const [emailValidado, setEmailValidado] = useState(false);

  // Estado para el formulario de números telefónicos
  const [numeroTelefonicoForm, setNumeroTelefonicoForm] = useState<NumeroTelefonicoForm>({
    numero: '',
    nombre: '',
    compania: ''
  });

  // Estado para mostrar mensajes de éxito o error
  const [mensaje, setMensaje] = useState<{ texto: string, tipo: 'exito' | 'error' | '' }>({
    texto: '',
    tipo: ''
  });


  // Estado para el formulario de campaña
  const [campanaForm, setCampanaForm] = useState<CampanaForm>({
    nombre: '',
    descripcion: '',
    subcuenta: null,
    credential_sheet_id: null,
    credential_template_id: null,
    credential_twilio_id: null,
  });

  // Estados para el formulario de "Asociar Campos"
  const [asociarCamposForm, setAsociarCamposForm] = useState<AsociarCamposForm>({
    usuario: '',
    subcuenta: null,
    campana: null,
    sheetId: '',
    hoja: '',
    rango: '',
    plantilla: null,
    sid: '', // Nuevo campo
    whatsapp: '', // Nuevo campo
    lista_negra: '', // Nuevo campo
    celular: ''  // Nuevo campo
  });

  const [campaignsData, setCampaignsData] = useState<CampaignData[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<CampaignData[]>([]);
  const [numberPhonesData, setNumberPhonesData] = useState<NumberPhoneData[]>([]);
  // Estado para controlar la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10;

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

  const filterCampaignsBySubcuenta = (subcuentaId: number) => {
    const filtered = campaignsData.filter(campana => Number(campana.Subcuenta) === subcuentaId);
    setFilteredCampaigns(filtered);
  };

  const handleSubcuentaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubcuenta = Number(e.target.value);
    setAsociarCamposForm(prevForm => ({ ...prevForm, subcuenta: selectedSubcuenta }));
  
    try {
      const response = await fetch(`http://localhost:3001/campaigns_by_sub_account/${selectedSubcuenta}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCampanasSubcuenta(data);
    } catch (error) {
      console.error("Could not fetch campaigns by subcuenta:", error);
    }
  };

  // Efecto para obtener el email del usuario al montar el componente
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch('http://localhost:3001/user-email');
        if (response.ok) {
          const data = await response.json();
          if (!email) {
            setEmail(data.email);
          }
        } else {
          console.error('Error al obtener el email del usuario:', response.status);
        }
      } catch (error) {
        console.error('Error al obtener el email del usuario:', error);
      }
    };

    fetchUserEmail();
  }, [email]);

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

    if (tabActiva === 'asociar-credenciales' || tabActiva === 'credenciales-tab') {
      fetchCredentials();
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

    if (tabActiva === 'crear-campana') {
      fetchCredentials();
    }
  }, [tabActiva]);

  // Efecto para cargar subcuentas del usuario cuando cambia el email
  useEffect(() => {
    const fetchUserSubcuentas = async () => {
      if (email) {
        try {
          const response = await fetch(`http://localhost:3001/sub_accounts_by_user?email=${email}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setUserSubcuentas(data);
        } catch (error) {
          console.error("Could not fetch user subcuentas:", error);
        }
      }
    };

    fetchUserSubcuentas();
  }, [email]);

  // Efecto para cargar campañas de la subcuenta seleccionada
  useEffect(() => {
    const fetchCampaignsBySubcuenta = async () => {
      if (subcuentaSeleccionada) {
        try {
          const response = await fetch(`http://localhost:3001/campaigns_by_sub_account?sub_account_id=${subcuentaSeleccionada}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setCampanasSubcuenta(data);
        } catch (error) {
          console.error("Could not fetch campaigns by subcuenta:", error);
        }
      }
    };
  
    fetchCampaignsBySubcuenta();
  }, [subcuentaSeleccionada]);
  

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

  // Efecto para cargar los números telefónicos al entrar en la pestaña de asociar números
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
    console.log("Campañas de la subcuenta seleccionada:", campanasSubcuenta);
  }, [campanasSubcuenta]);

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
  const handleBuscarUsuario = async () => {
    console.log("handleBuscarUsuario ejecutado");

    if (!email) {
      toast.error('Debe ingresar un correo electrónico');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/sub_accounts_by_user?email=${email}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserSubcuentas(data);

      if (data.length === 0) {
        toast.error('No se encontró ninguna subcuenta para este usuario');
        setEmailValidado(false);
      } else {
        toast.success(`Se encontró ${data.length} subcuentas para este usuario`);
        setEmailValidado(true);
      }

      // Resetear selecciones cuando se cambia de usuario
      setCampanaForm(prevForm => ({
        ...prevForm,
        subcuenta: null,
        credential_sheet_id: null,
        credential_template_id: null
      }));
      setCampanasSubcuenta([]); // Resetear campañas de la subcuenta

    } catch (error) {
      console.error("Error al buscar subcuentas:", error);
      toast.error('Error al buscar subcuentas para este usuario');
      setEmailValidado(false);
    }

    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };

  function handleEditCredencialClick(credencial: Credencial): void {
    setSelectedCredencial(credencial);
    setEditCredencialModalOpen(true);
  }

  const handleCloseCredencialModal = () => {
    setEditCredencialModalOpen(false);
    setSelectedCredencial(null);
  };

  const handleSaveCredencial = async (updatedCredencial: Credencial) => {
    try {
      // Adaptar el objeto para coincidir con lo que espera el backend
      const dataToSend = {
        id: updatedCredencial.id,
        name: updatedCredencial.name,
        json: updatedCredencial.json
      };

      const response = await fetch(`http://localhost:3001/credentials/${updatedCredencial.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success('Credencial actualizada exitosamente');

        // Actualiza la lista de credenciales
        if (tabActiva === 'credenciales-tab') {
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

          fetchCredentials();
        }

        // Cierra el modal
        handleCloseCredencialModal();
      } else {
        const errorData = await response.json();
        toast.error(`Error al actualizar la credencial: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      toast.error('Error al conectar con el servidor');
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };

  function handleEditCampanaClick(campana: CampaignData): void {
    setSelectedCampana(campana);
    setEditCampanaModalOpen(true);
  }

  const handleCloseCampanaModal = () => {
    setEditCampanaModalOpen(false);
    setSelectedCampana(null);
  };

  const handleSaveCampana = async (updatedCampana: any) => {
    try {
      // Preparar datos para enviar al servidor
      const dataToSend = {
        id: updatedCampana.id,
        name: updatedCampana.name,
        description: updatedCampana.description,
        sub_account_id: updatedCampana.sub_account_id,
        credential_twilio_id: updatedCampana.credential_twilio_id,
        credential_gcp_id: updatedCampana.credential_gcp_id
      };

      const response = await fetch(`http://localhost:3001/campaigns/${updatedCampana.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setMensaje({
          texto: 'Campaña actualizada exitosamente',
          tipo: 'exito'
        });

        // Actualiza la lista de campañas
        fetchCampaigns();

        // Cierra el modal
        handleCloseCampanaModal();
      } else {
        const errorData = await response.json();
        toast.error(`Error al actualizar la campaña: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setMensaje({
        texto: 'Error al conectar con el servidor',
        tipo: 'error'
      });
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };

  const handleSaveUser = async (updatedUser: Usuario) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        setMensaje({
          texto: 'Usuario actualizado exitosamente',
          tipo: 'exito'
        });

        // Actualiza la lista de usuarios
        const updatedUsers = usuarios.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        );
        setUsuarios(updatedUsers);

        // Cierra el modal
        handleCloseModal();
      } else {
        const errorData = await response.json();
        setMensaje({
          texto: `Error al actualizar el usuario: ${errorData.message || 'Error desconocido'}`,
          tipo: 'error'
        });
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setMensaje({
        texto: 'Error al conectar con el servidor',
        tipo: 'error'
      });
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };


  function handleEditNumeroTelefonicoClick(numeroTelefonico: NumeroTelefonico): void {
    setSelectedNumeroTelefonico(numeroTelefonico);
    setEditNumeroTelefonicoModalOpen(true);
  }

  const handleCloseNumeroTelefonicoModal = () => {
    setEditNumeroTelefonicoModalOpen(false);
    setSelectedNumeroTelefonico(null);
  };



  const handleSaveNumeroTelefonico = async (updatedNumeroTelefonico: NumeroTelefonico) => {
    try {
      // Adaptar el objeto para coincidir con lo que espera el backend
      const dataToSend = {
        id: updatedNumeroTelefonico.id,
        name: updatedNumeroTelefonico.nombre,
        company: updatedNumeroTelefonico.compania,
        number: updatedNumeroTelefonico.numero
      };

      const response = await fetch(`http://localhost:3001/number_phones/${updatedNumeroTelefonico.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setMensaje({
          texto: 'Número telefónico actualizado exitosamente',
          tipo: 'exito'
        });

        // Actualiza la lista de números telefónicos
        if (tabActiva === 'numeros-tab') {
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

          fetchNumberPhones();
        }

        // Cierra el modal
        handleCloseNumeroTelefonicoModal();
      } else {
        const errorData = await response.json();
        setMensaje({
          texto: `Error al actualizar el número telefónico: ${errorData.message || 'Error desconocido'}`,
          tipo: 'error'
        });
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setMensaje({
        texto: 'Error al conectar con el servidor',
        tipo: 'error'
      });
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };



  function handleEditSubcuentaClick(subcuenta: Subcuenta): void {
    setSelectedSubcuenta(subcuenta);
    setEditSubcuentaModalOpen(true);
    // loadUsuariosSelect();
  }

  const handleCloseSubcuentaModal = () => {
    setEditSubcuentaModalOpen(false);
    setSelectedSubcuenta(null);
  };

  const handleSaveSubcuenta = async (updatedSubcuenta: Subcuenta) => {
    try {
      // Adaptar el objeto para coincidir con lo que espera el backend
      const dataToSend = {
        id: updatedSubcuenta.id,
        nombre: updatedSubcuenta.nombre,  // Solo enviar el nombre
      };

      const response = await fetch(`http://localhost:3001/sub_accounts/${updatedSubcuenta.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      // resto del código...

      if (response.ok) {
        setMensaje({
          texto: 'Subcuenta actualizada exitosamente',
          tipo: 'exito'
        });

        // Actualiza la lista de subcuentas
        if (tabActiva === 'subcuentas-tab') {
          const fetchSubcuentas = async () => {
            try {
              const response = await fetch('http://localhost:3001/sub_accounts');
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              setSubcuentasData(data);
            } catch (error) {
              console.error("Could not fetch subcuentas:", error);
            }
          };

          fetchSubcuentas();
        }

        // Cierra el modal
        handleCloseSubcuentaModal();
      } else {
        const errorData = await response.json();
        setMensaje({
          texto: `Error al actualizar la subcuenta: ${errorData.message || 'Error desconocido'}`,
          tipo: 'error'
        });
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setMensaje({
        texto: 'Error al conectar con el servidor',
        tipo: 'error'
      });
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };

  const handleCreateSubcuenta = async () => {
    try {
      // Validar que todos los campos estén llenos
      if (!email || !nombreSubcuenta) {
        setMensaje({
          texto: 'Correo electrónico y nombre de subcuenta son requeridos',
          tipo: 'error'
        });
        return;
      }

      const response = await fetch('http://localhost:3001/sub_accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nombreSubcuenta }),
      });

      if (response.ok) {
        // Mostrar mensaje de éxito
        setMensaje({
          texto: `Subcuenta creada exitosamente para el usuario: ${email}`,
          tipo: 'exito'
        });

        // Limpiar los campos después de la creación exitosa
        setEmail('');
        setNombreSubcuenta('');

        // Si estamos en la pestaña de subcuentas-tab, actualizar la lista
        if (tabActiva === 'subcuentas-tab') {
          const fetchSubcuentas = async () => {
            try {
              const response = await fetch('http://localhost:3001/sub_accounts');
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              setSubcuentasData(data);
            } catch (error) {
              console.error("Could not fetch subcuentas:", error);
            }
          };

          fetchSubcuentas();
        }
      } else {
        const errorData = await response.json();
        console.error('Error al crear la subcuenta:', errorData);
        setMensaje({
          texto: `Error al crear la subcuenta: ${errorData.message || 'Error desconocido'}`,
          tipo: 'error'
        });
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setMensaje({
        texto: 'Error al conectar con el servidor',
        tipo: 'error'
      });
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };

  const handleCrearCredencial = async () => {
    try {
      // Validar que todos los campos estén llenos
      if (!nombreCredencial || !jsonCredencial) {
        setMensaje({
          texto: 'Nombre y JSON son requeridos',
          tipo: 'error'
        });
        return;
      }

      // Validar que el JSON sea válido
      try {
        // Intentar parsear el JSON para verificar que es válido
        JSON.parse(jsonCredencial);
      } catch (e) {
        setMensaje({
          texto: 'El formato JSON no es válido',
          tipo: 'error'
        });
        return;
      }

      // Enviar los datos al servidor
      const response = await fetch('http://localhost:3001/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nombreCredencial,
          json: jsonCredencial
        }),
      });

      if (response.ok) {
        // Mostrar mensaje de éxito
        setMensaje({
          texto: 'Credencial creada exitosamente',
          tipo: 'exito'
        });

        // Limpiar los campos después de la creación exitosa
        setNombreCredencial('');
        setJsonCredencial('{\n  "key": "value"\n}');
        if (textareaRef.current) {
          textareaRef.current.value = '{\n  "key": "value"\n}';
        }

        // Si estamos en la pestaña de credenciales-tab, actualizar la lista
        if (tabActiva === 'credenciales-tab') {
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

          fetchCredentials();
        }
      } else {
        const errorData = await response.json();
        console.error('Error al crear la credencial:', errorData);
        setMensaje({
          texto: `Error al crear la credencial: ${errorData.message || 'Error desconocido'}`,
          tipo: 'error'
        });
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setMensaje({
        texto: 'Error al conectar con el servidor',
        tipo: 'error'
      });
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };

  // Add these functions to manage phone associations
  const addPhoneAssociation = () => {
    setPhoneAssociations([...phoneAssociations, { number_phone: 0 }]);
  };

  // Functions to manage credential associations
  const addCredentialAssociation = () => {
    setCredentialAssociations([...credentialAssociations, { credential_id: 0 }]);
  };

  const removeCredentialAssociation = (index: number) => {
    if (credentialAssociations.length > 1) {
      const newAssociations = [...credentialAssociations];
      newAssociations.splice(index, 1);
      setCredentialAssociations(newAssociations);
    }
  };

  const removePhoneAssociation = (index: number) => {
    if (phoneAssociations.length > 1) {
      const newAssociations = [...phoneAssociations];
      newAssociations.splice(index, 1);
      setPhoneAssociations(newAssociations);
    }
  };

  // Agregar un nuevo número telefónico a la lista de asociaciones
  const handleAssociateNumbers = async () => {
    if (!subcuentaSeleccionada) {
      setMensaje({
        texto: 'Debe seleccionar una subcuenta',
        tipo: 'error'
      });
      return;
    }

    // Filtrar las asociaciones para quitar las que tengan un número telefónico inválido o no seleccionado (0)
    const validAssociations = phoneAssociations.filter(assoc => assoc.number_phone !== 0);

    if (validAssociations.length === 0) {
      setMensaje({
        texto: 'Debe seleccionar al menos un número telefónico',
        tipo: 'error'
      });
      return;
    }

    try {
      // Procesar cada asociación de numero telefonico
      for (const assoc of validAssociations) {
        const response = await fetch('http://localhost:3001/associate_number_phone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sub_account_id: subcuentaSeleccionada,
            number_phone_id: assoc.number_phone
          }),
        });

        if (!response.ok) {
          throw new Error(`Error al asociar el número: ${response.statusText}`);
        }
      }

      setMensaje({
        texto: 'Números telefónicos asociados exitosamente',
        tipo: 'exito'
      });

      // Resetea el formulario
      setPhoneAssociations([{ number_phone: 0 }]);
    } catch (error) {
      console.error('Error al asociar números:', error);
      setMensaje({
        texto: 'Error al asociar los números telefónicos',
        tipo: 'error'
      });
    }

    // borra el mensaje cada 5 segundos para que no se quede en pantalla
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };
  const handleAssociateCredentials = async () => {
    if (!subcuentaSeleccionada) {
      setMensaje({
        texto: 'Debe seleccionar una subcuenta',
        tipo: 'error'
      });
      return;
    }

    // Filtrar las asociaciones para quitar las que tengan una credencial inválida o no seleccionada (0)
    const validAssociations = credentialAssociations.filter(assoc => assoc.credential_id !== 0);

    if (validAssociations.length === 0) {
      setMensaje({
        texto: 'Debe seleccionar al menos una credencial',
        tipo: 'error'
      });
      return;
    }

    try {
      // Procesar cada asociación de credencial
      for (const assoc of validAssociations) {
        const response = await fetch('http://localhost:3001/associate_credential', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sub_account_id: subcuentaSeleccionada,
            credentials_id: assoc.credential_id
          }),
        });

        if (!response.ok) {
          throw new Error(`Error al asociar la credencial: ${response.statusText}`);
        }
      }

      setMensaje({
        texto: 'Credenciales asociadas exitosamente',
        tipo: 'exito'
      });

      // Resetear el formulario
      setCredentialAssociations([{ credential_id: 0 }]);
    } catch (error) {
      console.error('Error al asociar credenciales:', error);
      setMensaje({
        texto: 'Error al asociar las credenciales',
        tipo: 'error'
      });
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };


  // Handler para el formulario de campaña
  const handleCampanaFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampanaForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCampanaFormSubmit = async () => {
    try {
      // Validar que todos los campos requeridos estén llenos
      if (!campanaForm.nombre || !campanaForm.subcuenta || !campanaForm.credential_sheet_id || !campanaForm.credential_template_id) {
        setMensaje({
          texto: 'Todos los campos son obligatorios',
          tipo: 'error'
        });
        return;
      }

      // Enviar los datos al servidor
      const response = await fetch('http://localhost:3001/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: campanaForm.nombre,
          description: campanaForm.descripcion,
          sub_account_id: campanaForm.subcuenta,
          credential_sheet_id: campanaForm.credential_sheet_id,
          credential_template_id: campanaForm.credential_template_id,
          credential_twilio_id: campanaForm.credential_twilio_id,
        }),
      });

      if (response.ok) {
        // Mostrar mensaje de éxito
        setMensaje({
          texto: 'Campaña creada exitosamente',
          tipo: 'exito'
        });

        // Limpiar el formulario
        setCampanaForm(prev => ({
          ...prev,
          nombre: '',
          descripcion: '',
          subcuenta: null,
          credential_sheet_id: null,
          credential_template_id: null
        }));

        // Limpiar el email y las subcuentas
        setEmail('');
        setUserSubcuentas([]);

        // Si estamos en la pestaña de campañas, actualizar la lista
        if (tabActiva === 'campanas') {
          fetchCampaigns();
        }
      } else {
        const errorData = await response.json();
        console.error('Error al crear la campaña:', errorData);
        setMensaje({
          texto: `Error al crear la campaña: ${errorData.message || 'Error desconocido'}`,
          tipo: 'error'
        });
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setMensaje({
        texto: 'Error al conectar con el servidor',
        tipo: 'error'
      });
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
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

  // Nuevo handler para el formulario de número telefónico
  const handleNumeroTelefonicoFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNumeroTelefonicoForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Nuevo handler para crear número telefónico
  const handleCrearNumeroTelefonico = async () => {
    try {
      // Validar que todos los campos estén llenos
      if (!numeroTelefonicoForm.numero || !numeroTelefonicoForm.nombre || !numeroTelefonicoForm.compania) {
        setMensaje({
          texto: 'Todos los campos son obligatorios',
          tipo: 'error'
        });
        return;
      }

      // Enviar los datos al servidor
      const response = await fetch('http://localhost:3001/number_phones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: numeroTelefonicoForm.nombre,
          company: numeroTelefonicoForm.compania,
          number: numeroTelefonicoForm.numero
        }),
      });

      if (response.ok) {
        // Mostrar mensaje de éxito
        setMensaje({
          texto: 'Número telefónico creado exitosamente',
          tipo: 'exito'
        });

        // Limpiar el formulario
        setNumeroTelefonicoForm({
          numero: '',
          nombre: '',
          compania: ''
        });

        // Actualizar la lista de números telefónicos
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

        fetchNumberPhones();
      } else {
        const errorData = await response.json();
        console.error('Error al crear el número telefónico:', errorData);
        setMensaje({
          texto: `Error al crear el número telefónico: ${errorData.message || 'Error desconocido'}`,
          tipo: 'error'
        });
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setMensaje({
        texto: 'Error al conectar con el servidor',
        tipo: 'error'
      });
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };

  // Options para selects
  const subcuentasOptions = subcuentas.map(subcuenta => (
    <option
      key={subcuenta.id}
      value={subcuenta.id}
      style={{ color: 'black', fontWeight: 'bold' }}
    >
      {subcuenta.nombre}
    </option>
  ));
  const numerosTelefonicosOptions = numberPhonesData.map(numero => (
    <option key={numero.id} value={numero.id} style={{ color: 'black' }}>
      {numero.numero} - {numero.nombre}
    </option>
  ));

  // Obtenemos las opciones de campañas (necesario para el select de campañas)
  // const campanasOptions = campanas.map(campana => (
  //   <option
  //     key={campana.id}
  //     value={campana.id}
  //     style={{ color: 'black', fontWeight: 'bold' }}
  //   >
  //     {campana.nombre}
  //   </option>
  // ));

  // Estilos personalizados para los selects
  const selectStyle = {
    color: 'black',
    fontWeight: 'bold' as 'bold',
    backgroundColor: 'white'
  };

  function handleEditClick(usuario: Usuario): void {
    setSelectedUser(usuario);
    setEditModalOpen(true);
  }

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleSearchBottonClick = async () => {
    const { sheetId, hoja, campana } = asociarCamposForm;
    const rango = "A1:ZZ1"; // Rango por defecto
  
    // Verificar y restablecer los campos seleccionados
    if (asociarCamposForm.lista_negra) {
      setAsociarCamposForm(prevForm => ({ ...prevForm, lista_negra: '' }));
    }
    if (asociarCamposForm.whatsapp) {
      setAsociarCamposForm(prevForm => ({ ...prevForm, whatsapp: '' }));
    }
    if (asociarCamposForm.celular) {
      setAsociarCamposForm(prevForm => ({ ...prevForm, celular: '' }));
    }
  
    try {
      const response = await fetch(`http://localhost:3001/sheet/${sheetId}?sheetName=${hoja}&range=${rango}&campaignId=${campana}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  
      // Verificar que el campaign_id sea el mismo que el de la campaña seleccionada
      if (data.campaign_id !== campana) {
        toast.error('El Sheet ID no pertenece a la campaña seleccionada');
        return;
      }
  
      console.log("Sheet data:", data.sheetData);
      toast.success('Datos obtenidos de Google Sheets');
  
      // Actualizar el estado con los encabezados obtenidos
      setSheetHeaders(data.sheetData[0]); // Asumiendo que los encabezados están en la primera fila
    } catch (error) {
      console.error("Could not fetch sheet data:", error);
      toast.error('Error al obtener la hoja');
    }
  };
  // Función para consultar Sheets de Google
  const fetchSheetData = async (sheetId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/sheet/${sheetId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Sheet data:", data);
      // Aquí puedes hacer algo con los datos obtenidos
    } catch (error) {
      console.error("Could not fetch sheet data:", error);
    }
  };

  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [plantillaData, setPlantillaData] = useState(null);

  

  const fetchPlantillasByCampana = async (campanaId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/templates_by_campaign/${campanaId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Plantillas fetched:", data); // Añade este log para verificar los datos
      setPlantillas(data);
    } catch (error) {
      console.error("Could not fetch templates by campaign:", error);
    }
  };

  const handleCampanaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCampana = Number(e.target.value);
    setAsociarCamposForm(prevForm => ({ ...prevForm, campana: selectedCampana }));
    
    if (selectedCampana) {
      await fetchPlantillasByCampana(selectedCampana);
    }
  };

  useEffect(() => {
    console.log("Plantillas state updated:", plantillas); // Añade este log para verificar el estado
  }, [plantillas]);
  

  // useEffect para consultar el Sheet ID cuando cambie
  useEffect(() => {
    if (asociarCamposForm.sheetId) {
      fetchSheetData(asociarCamposForm.sheetId);
    }
  }, [asociarCamposForm.sheetId]);

  const [sheetHeaders, setSheetHeaders] = useState<string[]>([]);

  useEffect(() => {
    const whatsappHeader = sheetHeaders.find(header => header.toLowerCase() === 'whatsapp');
    if (whatsappHeader) {
      setAsociarCamposForm(prevForm => ({ ...prevForm, whatsapp: whatsappHeader }));
    }
  }, [sheetHeaders]);

  useEffect(() => {
    const listaNegraHeader = sheetHeaders.find(header => header.toLowerCase() === 'lista_negra');
    if (listaNegraHeader) {
      setAsociarCamposForm(prevForm => ({ ...prevForm, lista_negra: listaNegraHeader }));
    }
  }, [sheetHeaders]);

  useEffect(() => {
    const extraUnoHeader = sheetHeaders.find(header => header.toLowerCase() === 'celular');
    if (extraUnoHeader) {
      setAsociarCamposForm(prevForm => ({ ...prevForm, celular: extraUnoHeader }));
    }
  }, [sheetHeaders]);


  // Twilio
  const [plantillaContenido, setPlantillaContenido] = useState<string | null>(null);

  const fetchPlantillaContenido = async (templateSid: string, serviceSid: string) => {
    try {
      const response = await fetch(`/twilio_template/${templateSid}?serviceSid=${serviceSid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPlantillaContenido(data.content);
    } catch (error) {
      console.error("Could not fetch template content:", error);
    }
  };
//(event: React.ChangeEvent<HTMLSelectElement>)

const handlePlantillaChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedSid = event.target.value;
  setAsociarCamposForm({ ...asociarCamposForm, plantilla: selectedSid });

  if (selectedSid) {
    try {
      const response = await fetch(`/templates_by_sid/${selectedSid}`);
      const data = await response.json();
      if (response.ok) {
        // Manejar la respuesta de la plantilla aquí
        console.log('Plantilla:', data);
        // Actualizar el estado con los datos de la plantilla
        setPlantillaData(data);

        // Obtener el contenido de la plantilla de Twilio
        if (data.sid && data.campaign_id) {
          await fetchPlantillaContenido(data.sid, data.campaign_id);
        }
      } else {
        console.error('Error al obtener la plantilla:', data.message);
      }
    } catch (error) {
      console.error('Error al obtener la plantilla:', error);
    }
  }
};

  const fetchPlantillas = async (campaignId: number) => {
    try {
      const response = await fetch(`/templates_by_campaign/${campaignId}`);
      const data = await response.json();
      if (response.ok) {
        setPlantillas(data);
      } else {
        console.error('Error al obtener las plantillas:', data.message);
      }
    } catch (error) {
      console.error('Error al obtener las plantillas:', error);
    }
  };

  useEffect(() => {
    if (asociarCamposForm.campana) {
      fetchPlantillas(asociarCamposForm.campana);
    }
  }, [asociarCamposForm.campana]);

  const handleBuscarPlantilla = async () => {
    const selectedSid = asociarCamposForm.plantilla;
  
    if (selectedSid) {
      // Mostrar notificación con el SID seleccionado
      toast.info(`SID seleccionado: ${selectedSid}`);
      console.log('SID seleccionado:', selectedSid);
  
      try {
        const response = await fetch(`/campaigns_by_template/${selectedSid}`);
        const data = await response.json();
        if (response.ok) {
          // Manejar la respuesta de la plantilla aquí
          console.log('Plantilla:', data);
          // Actualizar el estado con los datos de la plantilla
          setPlantillaData(data);
  
          // Obtener el contenido de la plantilla de Twilio
          if (data.sid && data.campaign_id) {
            await fetchPlantillaContenido(data.sid, data.campaign_id);
          }
  
          // Mostrar notificación de éxito
          toast.success('Plantilla encontrada exitosamente');
        } else {
          console.error('Error al obtener la plantilla:', data.message);
          // Mostrar notificación de error
          toast.error('Error al obtener la plantilla: ' + data.message);
        }
      } catch (error) {
        console.error('Error al obtener la plantilla:', error);
        // Mostrar notificación de error
        toast.error('Error al obtener la plantilla');
      }
    }
  };


  const fetchTemplatesByCampaign = async (campaignId: number) => {
    if (!campaignId) return;
  
    try {
      const response = await fetch(`http://localhost:3001/templates_by_campaign/${campaignId}`);
      if (!response.ok) {
        throw new Error('Error al obtener las plantillas');
      }
  
      const data = await response.json();
      console.log('Plantillas obtenidas:', data);
  
      // Guarda las plantillas en el estado
      setPlantillas(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    if (asociarCamposForm.campana) {
      fetchTemplatesByCampaign(asociarCamposForm.campana);
    }
  }, [asociarCamposForm.campana]);



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
        {/* Mensaje de éxito o error */}
        {mensaje.texto && (
          <div className={`p-4 mb-4 rounded ${mensaje.tipo === 'exito' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
            {mensaje.texto}
          </div>
        )}

        {tabActiva === 'subcuentas' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear subcuenta</h2>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
              />
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black" onClick={handleBuscarUsuario}>Buscar</button>
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">Lista de usuarios</button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Nombre de la subcuenta</label>
              <input
                type="text"
                placeholder="Nombre de la subcuenta"
                value={nombreSubcuenta}
                onChange={(e) => setNombreSubcuenta(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-1 text-black"
              />
              <div className="text-right text-sm text-gray-500">0 / 50</div>
            </div>
            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
                onClick={handleCreateSubcuenta}
              >
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
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleEditClick(usuario)}
                      >
                        Editar
                      </button>
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
        {tabActiva === 'numeros' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear números telefónicos</h2>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Número de teléfono</label>
              <input
                type="text"
                name="numero"
                placeholder="Número de teléfono"
                value={numeroTelefonicoForm.numero}
                onChange={handleNumeroTelefonicoFormChange}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
              />
              <div className="text-right text-sm text-gray-500">{numeroTelefonicoForm.numero.length} / 10</div>
            </div>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={numeroTelefonicoForm.nombre}
                onChange={handleNumeroTelefonicoFormChange}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
              />
              <div className="text-right text-sm text-gray-500">{numeroTelefonicoForm.nombre.length} / 30</div>
            </div>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Compañía</label>
              <input
                type="text"
                name="compania"
                placeholder="Compañía"
                value={numeroTelefonicoForm.compania}
                onChange={handleNumeroTelefonicoFormChange}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
              />
              <div className="text-right text-sm text-gray-500">{numeroTelefonicoForm.compania.length} / 30</div>
            </div>
            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
                onClick={handleCrearNumeroTelefonico}
              >
                Crear número telefónico <FaPencilAlt />
              </button>
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
                    <td className="py-3 px-4 text-black">{numero.numero ? `+52 ${numero.numero}` : '+52 0'}</td>
                    <td className="py-3 px-4 text-black">{numero.creado}</td>
                    <td className="py-3 px-4 text-black">{numero.actualizado}</td>
                    <td className="py-3 px-4">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleEditNumeroTelefonicoClick(numero)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
                {numberPhonesData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-3 px-4 text-center text-gray-500">
                      No hay números telefónicos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <div className="text-gray-500">
                Mostrando {numberPhonesData.length > 0 ? (paginaActual - 1) * elementosPorPagina + 1 : 0} - {Math.min(paginaActual * elementosPorPagina, numberPhonesData.length)} de {numberPhonesData.length} registros
              </div>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 border border-gray-300 rounded ${paginaActual === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}
                  onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                  disabled={paginaActual === 1}
                >
                  Anterior
                </button>
                <button
                  className={`px-4 py-2 border border-gray-300 rounded ${paginaActual * elementosPorPagina >= numberPhonesData.length ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}
                  onClick={() => setPaginaActual(prev => numberPhonesData.length > prev * elementosPorPagina ? prev + 1 : prev)}
                  disabled={paginaActual * elementosPorPagina >= numberPhonesData.length}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
        {tabActiva === 'subcuentas-tab' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              {/* ... */}
              <tbody className="divide-y divide-gray-200">
                {subcuentasData.map(subcuenta => (
                  <tr key={subcuenta.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{subcuenta.id}</td>
                    <td className="py-3 px-4 text-black">{subcuenta.Usuario}</td>
                    <td className="py-3 px-4 text-black">{subcuenta.Nombre}</td>
                    <td className="py-3 px-4 text-black">{subcuenta.Creado}</td>
                    <td className="py-3 px-4 text-black">{subcuenta.Actualizado}</td>
                    <td className="py-3 px-4">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleEditSubcuentaClick({
                          id: subcuenta.id,
                          nombre: subcuenta.Nombre,     // Cambiado de name a nombre
                          usuario: subcuenta.Usuario,   // Cambiado de user_id a usuario
                          creado: subcuenta.Creado,     // Cambiado de created_at a creado
                          actualizado: subcuenta.Actualizado  // Cambiado de updated_at a actualizado
                        })}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* ... */}
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
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleEditCampanaClick(campana)}
                      >
                        Editar
                      </button>
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
        {tabActiva === 'credenciales' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear credenciales</h2>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Nombre de la credencial</label>
              <input
                type="text"
                placeholder="Nombre"
                value={nombreCredencial}
                onChange={(e) => setNombreCredencial(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
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
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleEditCredencialClick(credencial)}
                      >
                        Editar
                      </button>
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
        {tabActiva === 'asociar-numeros' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Asociar números telefónicos</h2>
            <hr className="border-t-2 border-gray-200 dark:border-gray-700 mb-6" />

            {/* Usuario */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Usuario</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  placeholder="Correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                />
                <button
                  className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                  onClick={handleBuscarUsuario}
                >
                  Buscar
                </button>
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">
                  Lista de usuarios
                </button>
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
                disabled={userSubcuentas.length === 0}
              >
                <option value={0} style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar compañía</option>
                {userSubcuentas.map(subcuenta => (
                  <option
                    key={subcuenta.id}
                    value={subcuenta.id}
                    style={{ color: 'black', fontWeight: 'bold' }}
                  >
                    {subcuenta.Nombre}
                  </option>
                ))}
              </select>
            </div>

            <hr className="border-t-2 border-gray-200 dark:border-gray-700 mb-6" />
            <h3 className="text-xl font-semibold mb-4 text-gray-600">Números telefónicos</h3>

            {/* Dynamic phone number associations */}
            {phoneAssociations.map((association, index) => (
              <div key={index} className="flex gap-3 mb-4 overflow-auto">
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">Número telefónico</label>
                  <select
                    value={association.number_phone}
                    onChange={(e) => {
                      const newAssociations = [...phoneAssociations];
                      newAssociations[index].number_phone = Number(e.target.value);
                      setPhoneAssociations(newAssociations);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    style={selectStyle}
                    disabled={subcuentaSeleccionada === 0}
                  >
                    <option value={0} style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar número telefónico</option>
                    {numerosTelefonicosOptions}
                  </select>
                </div>
                <div className="flex items-end mb-1">
                  <div className="flex gap-1">
                    <button
                      className="px-2 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                      onClick={addPhoneAssociation}
                      disabled={subcuentaSeleccionada === 0}
                    >
                      <span className="text-xl">+</span>
                    </button>
                    <button
                      className="px-2 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                      onClick={() => removePhoneAssociation(index)}
                      disabled={subcuentaSeleccionada === 0 || phoneAssociations.length <= 1}
                    >
                      <span className="text-xl">-</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <hr className="border-t-2 border-gray-200 dark:border-gray-700 mb-6" />
            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
                onClick={handleAssociateNumbers}
              >
                Asociar números telefónicos <FaPencilAlt />
              </button>
            </div>
          </div>
        )}
        {tabActiva === 'asociar-credenciales' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Asociar Credenciales</h2>
            <hr className="border-t-2 border-gray-200 dark:border-gray-700 mb-6" />

            {/* Usuario */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Usuario</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  placeholder="Correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                />
                <button
                  className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                  onClick={handleBuscarUsuario}
                >
                  Buscar
                </button>
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">
                  Lista de usuarios
                </button>
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
                disabled={userSubcuentas.length === 0}
              >
                <option value={0} style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar compañía</option>
                {userSubcuentas.map(subcuenta => (
                  <option
                    key={subcuenta.id}
                    value={subcuenta.id}
                    style={{ color: 'black', fontWeight: 'bold' }}
                  >
                    {subcuenta.Nombre}
                  </option>
                ))}
              </select>
            </div>

            <hr className="border-t-2 border-gray-200 dark:border-gray-700 mb-6" />
            <h3 className="text-xl font-semibold mb-4 text-gray-600">Credenciales</h3>

            {/* Dynamic credential associations */}
            {credentialAssociations.map((association, index) => (
              <div key={index} className="flex gap-3 mb-4 overflow-auto">
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">Credencial</label>
                  <select
                    value={association.credential_id}
                    onChange={(e) => {
                      const newAssociations = [...credentialAssociations];
                      newAssociations[index].credential_id = Number(e.target.value);
                      setCredentialAssociations(newAssociations);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    style={selectStyle}
                    disabled={subcuentaSeleccionada === 0}
                  >
                    <option value={0} style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar credencial</option>
                    {credentials
                      .filter(credencial => credencial.name.toLowerCase() !== 'no') // Filtrar credenciales con nombre "no"
                      .map(credencial => (
                        <option key={credencial.id} value={credencial.id} style={{ color: 'black' }}>
                          {credencial.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div className="flex items-end mb-1">
                  <div className="flex gap-1">
                    <button
                      className="px-2 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                      onClick={addCredentialAssociation}
                      disabled={subcuentaSeleccionada === 0}
                    >
                      <span className="text-xl">+</span>
                    </button>
                    <button
                      className="px-2 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                      onClick={() => removeCredentialAssociation(index)}
                      disabled={subcuentaSeleccionada === 0 || credentialAssociations.length <= 1}
                    >
                      <span className="text-xl">-</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <hr className="border-t-2 border-gray-200 dark:border-gray-700 mb-6" />
            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
                onClick={handleAssociateCredentials}
              >
                Asociar credenciales <FaPencilAlt />
              </button>
            </div>
          </div>
        )}
        {tabActiva === 'crear-campana' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Campaña</h2>

            {/* Nombre y Descripción */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre de la campaña"
                value={campanaForm.nombre}
                onChange={handleCampanaFormChange}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={3}
                placeholder="Descripción de la campaña"
                value={campanaForm.descripcion}
                onChange={handleCampanaFormChange}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
              />
            </div>

            {/* Usuario y Subcuenta */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Usuario y Subcuenta</h3>
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Usuario</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="email"
                    id="usuario"
                    name="usuario"
                    placeholder="Correo del usuario"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                  />
                  <button
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                    onClick={handleBuscarUsuario}
                  >
                    Buscar
                  </button>
                  <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">
                    Lista de usuarios
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Subcuenta</label>
                <select
                  id="subcuenta"
                  name="subcuenta"
                  value={campanaForm.subcuenta || ''}
                  onChange={(e) => setCampanaForm((prevForm) => ({ ...prevForm, subcuenta: Number(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={selectStyle}
                  disabled={userSubcuentas.length === 0}
                >
                  <option value="" style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar subcuenta</option>
                  {userSubcuentas.map(subcuenta => (
                    <option
                      key={subcuenta.id}
                      value={subcuenta.id}
                      style={{ color: 'black', fontWeight: 'bold' }}
                    >
                      {subcuenta.Nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Credenciales */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Credenciales</h3>

              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Credencial para Google Sheets</label>
                <select
                  id="credential_sheet_id"
                  name="credential_sheet_id"
                  value={campanaForm.credential_sheet_id || ''}
                  onChange={(e) => setCampanaForm((prevForm) => ({ ...prevForm, credential_sheet_id: Number(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={selectStyle}
                  disabled={campanaForm.subcuenta === null}
                >
                  <option value="" style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar credencial para Google Sheets</option>
                  {credentials.map(credencial => (
                    <option key={credencial.id} value={credencial.id} style={{ color: 'black' }}>
                      {credencial.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Credencial para mensajes y plantillas</label>
                <select
                  id="credential_template_id"
                  name="credential_template_id"
                  value={campanaForm.credential_template_id || ''}
                  onChange={(e) => setCampanaForm((prevForm) => ({ ...prevForm, credential_template_id: Number(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={selectStyle}
                  disabled={campanaForm.subcuenta === null}
                >
                  <option value="" style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar credencial para mensajes</option>
                  {credentials
                    .filter(credencial => credencial.name.toLowerCase() !== 'no')
                    .map(credencial => (
                      <option key={credencial.id} value={credencial.id} style={{ color: 'black' }}>
                        {credencial.name}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 px-5 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
                onClick={handleCampanaFormSubmit}
              >
                Guardar campaña <FaPencilAlt />
              </button>
            </div>
          </div>
        )}
        {/* ZZZ









        ZZZ */}
        {tabActiva === 'asociar-campos' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Asociar Campos</h2>

            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Usuario</label>
              <input
                type="email"
                id="usuario"
                name="usuario"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
              />
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black"
                  onClick={() => {
                    handleBuscarUsuario();
                    setSubcuentaSeleccionada(0);
                    setAsociarCamposForm(prevForm => ({ ...prevForm, subcuenta: null, campana: null, plantilla: null }));
                    if (!email) {
                      setEmailValidado(false);
                    }
                  }}
                >
                  Buscar
                </button>
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">
                  Lista de usuarios
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block font-medium text-gray-700 mb-1">Subcuenta</label>
                <select
                  id="subcuenta"
                  name="subcuenta"
                  value={asociarCamposForm.subcuenta || ''}
                  onChange={handleSubcuentaChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={selectStyle}
                  disabled={userSubcuentas.length === 0 || !emailValidado}
                >
                  <option value="" disabled style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar subcuenta</option>
                  {userSubcuentas.map(subcuenta => (
                    <option
                      key={subcuenta.id}
                      value={subcuenta.id}
                      style={{ color: 'black', fontWeight: 'bold' }}
                    >
                      {subcuenta.Nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block font-medium text-gray-700 mb-1">Campaña</label>
                <select
                  name="campana"
                  value={asociarCamposForm.campana || ''}
                  onChange={handleCampanaChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={selectStyle}
                  disabled={!asociarCamposForm.subcuenta} // Deshabilitar si no hay subcuenta seleccionada
                >
                  <option value="" disabled style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar campaña</option>
                  {campanasSubcuenta.map(campana => (
                    <option key={campana.ID} value={campana.ID} style={{ color: 'black', fontWeight: 'bold' }}>
                      {campana.Nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-1/2">
              <label className="block font-medium text-gray-700 mb-1">Sheet ID</label>
              <input
                type="text"
                name="sheetId"
                placeholder="ID de la hoja de cálculo"
                value={asociarCamposForm.sheetId}
                onChange={handleAsociarCamposChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>

            <div className="w-1/6">
              <label className="block font-medium text-gray-700 mb-1">Hoja</label>
              <input
                type="text"
                name="hoja"
                placeholder="Hoja Sheets"
                value={asociarCamposForm.hoja}
                onChange={handleAsociarCamposChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>

            <div className="w-1/6">
              <label className="block font-medium text-gray-700 mb-1">Rango</label>
              <input
                type="text"
                name="rango"
                placeholder="Celdas"
                value={asociarCamposForm.rango}
                onChange={handleAsociarCamposChange}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
            </div>

            <div className="flex items-end">
              <button
                className="px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
                onClick={handleSearchBottonClick}
                disabled={!asociarCamposForm.campana || !asociarCamposForm.sheetId || !asociarCamposForm.hoja || !asociarCamposForm.rango}
              >
                Buscar
              </button>
            </div>
          </div>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block font-medium text-gray-700 mb-1">Lista Negra</label>
                <select
                  name="lista_negra"
                  value={asociarCamposForm.lista_negra || ''}
                  onChange={(e) => setAsociarCamposForm(prevForm => ({ ...prevForm, lista_negra: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={selectStyle}
                  disabled={!!asociarCamposForm.sheetId || !asociarCamposForm.sheetId}
                >
                  <option value="" disabled style={{ color: 'black', fontWeight: 'bold' }}>Sin definir</option>
                  {sheetHeaders.map((header, index) => (
                    <option key={index} value={header} style={{ color: 'black', fontWeight: 'bold' }} disabled>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-medium text-gray-700 mb-1">WhatsApp (estatus)</label>
                <select
                  name="whatsapp"
                  value={asociarCamposForm.whatsapp || ''}
                  onChange={(e) => setAsociarCamposForm(prevForm => ({ ...prevForm, whatsapp: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={selectStyle}
                  disabled={!!asociarCamposForm.sheetId || !asociarCamposForm.sheetId} 
                >
                  <option value="" disabled style={{ color: 'black', fontWeight: 'bold' }}>Sin definir</option>
                  {sheetHeaders.map((header, index) => (
                    <option key={index} value={header} style={{ color: 'black', fontWeight: 'bold' }} disabled>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-medium text-gray-700 mb-1">Contacto</label>
                <select
                  name="celular"
                  value={asociarCamposForm.celular || ''}
                  onChange={(e) => setAsociarCamposForm(prevForm => ({ ...prevForm, celular: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={selectStyle}
                  disabled={!!asociarCamposForm.sheetId || !asociarCamposForm.sheetId}
                >
                  <option value="" disabled style={{ color: 'black', fontWeight: 'bold' }}>Sin definir</option>
                  {sheetHeaders.map((header, index) => (
                    <option key={index} value={header} style={{ color: 'black', fontWeight: 'bold' }} disabled>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-1">Plantilla de Twilio</label>
                <select
                  name="plantilla"
                  value={asociarCamposForm.plantilla || ''}
                  onChange={handlePlantillaChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={selectStyle}
                  disabled={!asociarCamposForm.campana} // Deshabilitar si no hay campaña seleccionada
                >
                  <option value="" disabled style={{ color: 'black', fontWeight: 'bold' }}>Seleccionar plantilla</option>
                  {plantillas.map((plantilla) => (
                    <option key={plantilla.ID} value={plantilla.sid} style={{ color: 'black', fontWeight: 'bold' }}>
                      {plantilla.Nombre}
                    </option>
                  ))}
                </select>
                <button
                  className="mt-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2]"
                  onClick={handleBuscarPlantilla}
                  disabled={!asociarCamposForm.plantilla} // Deshabilitar si no hay plantilla seleccionada
                >
                  Buscar Plantilla
                </button>
              </div>

              {plantillaData && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700">Contenido de la Plantilla</h3>
                <pre className="p-4 border border-gray-300 rounded bg-gray-50">
                  {JSON.stringify(plantillaData, null, 2)}
                </pre>
              </div>
            )}

            {plantillaContenido && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700">Contenido de la Plantilla de Twilio</h3>
                <pre className="p-4 border border-gray-300 rounded bg-gray-50">
                  {plantillaContenido}
                </pre>
              </div>
            )}
            </div>

            {/*  */}






            <div className="flex justify-end">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#673ab7] text-white rounded hover:bg-[#7b1fa2] ml-auto"
                onClick={handleAsociarCamposSubmit}
                disabled={!asociarCamposForm.campana}
              >
                Guardar Asociaciones <FaPencilAlt />
              </button>
            </div>
          </div>
        )}

      </main>
      {/* ZZZ









        ZZZ */}
      <footer className="flex justify-between items-center bg-gray-900 text-white px-4 py-2">
        <div>2025</div>
        <div>AUTO INSIGHTS</div>
      </footer>
      {editModalOpen && (
        <UserEditModal
          usuario={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          isOpen={editModalOpen}
        />
      )}

      {editNumeroTelefonicoModalOpen && (
        <NumeroTelefonicoEditModal
          numeroTelefonico={selectedNumeroTelefonico}
          onClose={handleCloseNumeroTelefonicoModal}
          onSave={handleSaveNumeroTelefonico}
          isOpen={editNumeroTelefonicoModalOpen}
        />
      )}

      {editSubcuentaModalOpen && (
        <SubcuentaEditModal
          subcuenta={selectedSubcuenta}
          onClose={handleCloseSubcuentaModal}
          onSave={handleSaveSubcuenta}
          isOpen={editSubcuentaModalOpen}
        />
      )}

      {editCredencialModalOpen && (
        <CredencialEditModal
          credencial={selectedCredencial}
          onClose={handleCloseCredencialModal}
          onSave={handleSaveCredencial}
          isOpen={editCredencialModalOpen}
        />
      )}

      {editCampanaModalOpen && (
        <CampanaEditModal
          campana={selectedCampana}
          subcuentas={subcuentasData}
          credenciales={credentials}
          onClose={handleCloseCampanaModal}
          onSave={handleSaveCampana}
          isOpen={editCampanaModalOpen}
        />
      )}
      
      <ToastContainer 
        position="top-right" 
        autoClose={3500} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        style={{ marginTop: '100px' }} // Ajusta el valor según sea necesario
      />

    </div>
  );
};

export default Admin;