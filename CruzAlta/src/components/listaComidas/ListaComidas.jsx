import React, { useEffect, useState } from 'react';
import ComidaCard from './ComidaCard';

const ListaComidas = () => {
  const [comidas, setComidas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComidas = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Comidas/GetAll`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error detalle:", errorText);
          throw new Error(`Error al obtener comidas: ${response.status}`);
        }

        const data = await response.json();
        setComidas(data);
      } catch (err) {
        setError('Error al cargar las comidas');
        console.error("Error en fetch comidas:", err);
      }
    };

    fetchComidas();
  }, []);

  const agregarAlPedido = (item) => {
    console.log('Agregar al pedido:', item);
    // Aquí puedes manejar el pedido: guardarlo en estado, context, o localStorage
  };

  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {comidas.map(comida => (
        <ComidaCard
          key={comida.idComida}
          comida={comida}
          onAgregarAlPedido={agregarAlPedido}
        />
      ))}
    </div>
  );
};

export default ListaComidas;
