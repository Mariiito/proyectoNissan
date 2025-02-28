import React from 'react';

const Monitor: React.FC = () => {
  return (
    <div className="bg-stone-900 text-white"> {/* Background Oscuro General */}
      <div className="flex flex-col h-screen">

        {/* Tabla principal */}
        <div className="flex-grow overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="py-2 px-4">Fecha de envío</th>
                <th className="py-2 px-4">Mensajes enviados</th>
                <th className="py-2 px-4">Rango</th>
                <th className="py-2 px-4">Estado del envío</th>
                <th className="py-2 px-4">Estado de actualización</th>
              </tr>
            </thead>
            <tbody>
              {/* Primera Fila */}
              <tr>
                <td className="py-2 px-4">
                  <details>
                    <summary>2025-02-25T00:00:00-07:00</summary>
                    <div className="ml-4">
                      <div>SID: MM2640d2f9511ef741d192c59542817bf9</div>
                      <div>SID: MM8e0abb8487155345c955580eb9c1ab0b</div>
                    </div>
                  </details>
                </td>
                <td className="py-2 px-4">2</td>
                <td className="py-2 px-4">1:3</td>
                <td className="py-2 px-4">REALIZADO</td>
                <td className="py-2 px-4">REALIZADO</td>
              </tr>

              {/* Segunda Fila (ejemplo) */}
              <tr>
                <td className="py-2 px-4">
                  <details>
                    <summary>2025-02-25T00:00:00-07:00</summary>
                    <div className="ml-4">
                      <div>Numero: whatsapp: +526623254234</div>
                      <div>Numero: whatsapp: +526621600382</div>
                    </div>
                  </details>
                </td>
                <td className="py-2 px-4">2</td>
                <td className="py-2 px-4">1:3</td>
                <td className="py-2 px-4">REALIZADO</td>
                <td className="py-2 px-4">Estado: READ</td>
              </tr>

              {/* Más filas aquí... */}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-end items-center py-2 px-4">
          <button className="px-2 py-1 rounded-md">{'<'}</button>
          <span className="mx-2">1</span>
          <button className="px-2 py-1 rounded-md">{'>'}</button>
        </div>
      </div>
    </div>
  );
};

export default Monitor;