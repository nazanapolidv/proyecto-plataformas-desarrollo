import ListEspecialidades from "./listEspecialidades";
import { useAuth } from "../context/AuthContext";

const Admin = () => {
  const { user } = useAuth();

  return (
    <div className="admin-container p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <h3 className="text-lg font-semibold mb-2">ABM especializaciones</h3>
      <p className="mb-4">Desde este panel vas a poder gestionar las especializaciones médicas.</p>

      <ListEspecialidades />
    </div>
  );
};

export default Admin;
