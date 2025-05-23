import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert } from "react-bootstrap";
/*estilos */ 
import './CocinaPage.css'; 

const CocinaPage = () => {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = "https://localhost:7042/api/Pedido/cocina";

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const res = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      });
      setFilas(res.data);
    } catch (err) {
      console.error("Error al obtener pedidos", err);
      setError("Error al cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Órdenes para Cocina</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped  bordered hover className="cocina-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Cantidad</th>
              <th>Menú</th>
              <th>Hora de Entrega</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, index) => (
              <tr key={index}>
                <td>{fila.cliente}</td>
                <td>{fila.cantidad}</td>
                <td>{fila.menu}</td>
                <td>{new Date(fila.horaEntrega).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>{fila.nota || "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CocinaPage;
