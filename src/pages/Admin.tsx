import React, { useState } from 'react';
import { FaPencilAlt, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Usuario {
  id: number;
  usuario: string;
  email: string;
  nombre: string;
  admin: boolean;
  activo: boolean;
  creacion: string;
  ultimoLogin: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      usuario: 'admin',
      email: 'admin@grupoautoauto.com.mx',
      nombre: 'Admin Admin',
      admin: true,
      activo: true,
      creacion: '11/27/2023, 10:24:17',
      ultimoLogin: 'N/A'
    },
    {
      id: 2,
      usuario: 'hector_miguel',
      email: 'hector.m@grupoautoauto.com.mx',
      nombre: 'Hector Miguel Castro Arredondo',
      admin: false,
      activo: true,
      creacion: '11/27/2023, 10:37:55',
      ultimoLogin: '13/2/2023, 16:55:31'
    },
    {
      id: 3,
      usuario: 'Gerente BDC Posventa Grupo Huerpi',
      email: 'gerente.bdc.posventa@huerpi.mx',
      nombre: 'Carlos Vazquez',
      admin: false,
      activo: true,
      creacion: '11/27/2023, 3:37:55',
      ultimoLogin: 'N/A'
    },
    {
      id: 4,
      usuario: 'Gerente bdc',
      email: 'huerpi@automagtx.mx',
      nombre: 'Carlos Vazquez',
      admin: false,
      activo: true,
      creacion: '10/27/2023, 20:37:55',
      ultimoLogin: 'N/A'
    },
    {
      id: 5,
      usuario: 'Angel',
      email: 'miguel.b@grupoautoauto.com.mx',
      nombre: 'Angel Ramos',
      admin: false,
      activo: true,
      creacion: '10/27/2023, 20:37:55',
      ultimoLogin: 'N/A'
    },
    {
      id: 6,
      usuario: 'gsme-masivos',
      email: 'gsme.mx@digitaltolk.mx',
      nombre: 'Karla Rivera',
      admin: false,
      activo: true,
      creacion: '27/2/2023, 3:31:00',
      ultimoLogin: 'N/A'
    }
  ]);

  const [nombreSubcuenta, setNombreSubcuenta] = useState('');
  const [email, setEmail] = useState('');
  const [tabActiva, setTabActiva] = useState('usuarios');

  const handleCreateSubcuenta = () => {
    // Aquí iría la lógica para crear una subcuenta
    alert(`Creando subcuenta: ${nombreSubcuenta}`);
  };
  
  const handleLogout = () => {
    navigate('/'); // Navega a la ruta de login "/"
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-[#673ab7] text-white px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Panel administrativo</h1>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Cerrar sesión
        </button>
      </header>

      <nav className="flex overflow-x-auto bg-gray-900 text-white">
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'subcuentas' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('subcuentas')}
        >
          Subcuentas
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'numeros' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('numeros')}
        >
          Números telefónicos
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'credenciales' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('credenciales')}
        >
          Credenciales
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'asociar-numeros' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('asociar-numeros')}
        >
          Asociar números telefónicos
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'asociar-credenciales' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('asociar-credenciales')}
        >
          Asociar credenciales
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'crear-campana' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('crear-campana')}
        >
          Crear campaña
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'asociar-campos' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('asociar-campos')}
        >
          Asociar campos
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'usuarios' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('usuarios')}
        >
          Usuarios
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'subcuentas-tab' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('subcuentas-tab')}
        >
          Subcuentas
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'numeros-tab' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('numeros-tab')}
        >
          Números telefónicos
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'credenciales-tab' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('credenciales-tab')}
        >
          Credenciales
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${tabActiva === 'campanas' ? 'bg-[#673ab7]' : 'hover:bg-gray-700'}`} 
          onClick={() => setTabActiva('campanas')}
        >
          Campañas
        </button>
      </nav>

      <main className="flex-1 p-6 overflow-auto">
        {tabActiva === 'subcuentas' && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear subcuenta</h2>
            
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
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">
                  Buscar
                </button>
                <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">
                  Lista de usuarios
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-1">Nombre de la subcuenta</label>
              <input 
                type="text" 
                placeholder="Nombre de la subcuenta"
                value={nombreSubcuenta}
                onChange={(e) => setNombreSubcuenta(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-1"
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
                  <th className="py-3 px-4 text-left font-medium text-black">NOMBRE</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ADMIN</th>
                  <th className="py-3 px-4 text-left font-medium text-black">CREACIÓN</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ACTIVO</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ÚLTIMO LOGIN</th>
                  <th className="py-3 px-4 text-left font-medium text-black">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuarios.map(usuario => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-black">{usuario.id}</td>
                    <td className="py-3 px-4">
                      <div className="text-black">{usuario.usuario}</div>
                      <div className="text-xs text-gray-500">{usuario.email}</div>
                    </td>
                    <td className="py-3 px-4 text-black">{usuario.nombre}</td>
                    <td className="py-3 px-4 text-black">{usuario.admin ? 'SI' : 'NO'}</td>
                    <td className="py-3 px-4 text-black">{usuario.creacion}</td>
                    <td className="py-3 px-4 text-black">{usuario.activo ? 'SI' : 'NO'}</td>
                    <td className="py-3 px-4 text-black">{usuario.ultimoLogin}</td>
                    <td className="py-3 px-4">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4 gap-2">
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">
                Anterior
              </button>
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-black">
                Siguiente
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