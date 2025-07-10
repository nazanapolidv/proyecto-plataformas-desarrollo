import ListEspecialidades from "./listEspecialidades";

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.rol === 'administrador';

  if (isAdmin) {
    return (
      <div className="admin-container p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
        <h3 className="text-lg font-semibold mb-2">ABM especializaciones</h3>
        <p className="mb-4">Desde este panel vas a poder gestionar las especializaciones médicas.</p>

        <ListEspecialidades />
      </div>
    );
  }

  return (
    <div className="not-authorized p-6">
      <h2 className="text-xl font-bold text-red-600 text-center">No tenés permisos para acceder a esta sección</h2>
      <p className="text-gray-700 text-center">Por favor, iniciá sesión con una cuenta de administrador.</p>
    </div>
  );
};

export default Admin;
