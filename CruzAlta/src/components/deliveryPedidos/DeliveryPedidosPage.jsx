import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; 

const DeliveryPedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    const { sub: idDelivery } = jwtDecode(token);

    axios.get("https://localhost:7042/api/pedido/delivery", {
    headers: {
        Authorization: `Bearer ${token}`
    }
    })

      .then(res => setPedidos(res.data))
      .catch(err => console.error("Error al obtener pedidos:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Pedidos asignados</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos asignados.</p>
      ) : (
        <div className="list-group">
          {pedidos.map(p => (
            <div key={p.idPedido} className="list-group-item">
              <h5>Pedido #{p.idPedido}</h5>
              <p><strong>Cliente:</strong> {p.clienteNombre}</p>
              <p><strong>Dirección:</strong> {p.menus.map(m => m.nombreMenu).join(", ")}</p>
              <p><strong>Menús:</strong>
                <ul>
                  {p.menus.map(m => (
                    <li key={m.idMenu}>
                      {m.nombreMenu} - ${m.precio} <br />
                      Comidas: {m.comidas.join(', ')}
                    </li>
                  ))}
                </ul>
              </p>
              <p><strong>Total:</strong> ${p.menus.reduce((sum, m) => sum + m.precio, 0)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryPedidosPage;
