const SinAuth = () => (
  <div className="not-authorized p-6 h-[60vh] flex flex-col items-center justify-center">
    <h2 className="text-xl font-bold text-red-600 text-center">No tenés permisos para acceder a esta sección</h2>
    <p className="text-gray-700 text-center">Por favor, iniciá sesión con una cuenta competente.</p>
  </div>
);
export default SinAuth;