import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner } from 'react-bootstrap';

const PedidosAdminPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarPedidos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7042/api/Pedido/GetAll', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPedidos(response.data);
    } catch (error) {
      console.error('❌ Error al obtener pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  if (loading) return <Spinner animation="border" className="m-5" />;

  return (
    <div className="container mt-4">
      <h2>Pedidos Registrados</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos cargados.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Menús</th>
              <th>Estado</th>
              <th>Método Entrega</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido, index) => (
              <tr key={pedido.idPedido}>
                <td>{index + 1}</td>
                <td>{pedido.clienteNombre}</td>
                <td>{pedido.fechaPedido.split('T')[0]}</td>
                <td>{new Date(pedido.horaPedido).toLocaleTimeString()}</td>
                <td>
                  <ul>
                    {pedido.menus.map((menu, i) => (
                      <li key={i}>
                        <strong>{menu.nombreMenu}</strong> x{menu.cantidad} ({menu.tamaño})<br />
                        <small>{menu.comidas.map(c => c.nombre).join(', ')}</small>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{pedido.estado}</td>
                <td>{pedido.metodoEntrega}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PedidosAdminPage;
