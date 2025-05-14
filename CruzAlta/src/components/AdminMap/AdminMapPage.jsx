import React from 'react';
import AdminMap from './AdminMap'; // ya está en la misma carpeta

const AdminMapPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Mapa de Ubicación de Deliverys</h2>
      <AdminMap />
    </div>
  );
};

export default AdminMapPage;
