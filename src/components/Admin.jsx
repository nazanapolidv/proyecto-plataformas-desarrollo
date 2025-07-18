import ListEspecialidades from "./listEspecialidades";
import SinAuth from "./SinAuth";

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.rol === 'admin' || user?.rol === 'administrador';
  
  console.log('🔧 Admin - User:', user);
  console.log('🔧 Admin - User role:', user?.rol);
  console.log('🔧 Admin - IsAdmin:', isAdmin);

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
    <SinAuth />
  );
};

export default Admin;
