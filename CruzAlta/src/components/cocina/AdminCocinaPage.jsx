import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import "./CocinaPage.css";

const AdminCocinaPage = () => {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const apiUrl = "https://localhost:7042/api/Pedido/cocina";
  const marcarDetalleListoUrl =
    "https://localhost:7042/api/Pedido/marcar-detalle-listo"; // NUEVO ENDPOINT
useEffect(() => {
  if (mensaje) {
    const timer = setTimeout(() => {
      setMensaje(null);
    }, 3000); // 3 segundos

    return () => clearTimeout(timer); // limpieza si el componente se desmonta o el mensaje cambia
  }
}, [mensaje]);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const res = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setFilas(res.data);
    } catch (err) {
      console.error("Error al obtener pedidos", err);
      setError("Error al cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const marcarDetalleComoListo = async (idDetalle) => {
    try {
      await axios.put(`${marcarDetalleListoUrl}/${idDetalle}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setMensaje("Detalle marcado como listo.");

      // 🔁 Remover el detalle marcado del estado local
      setFilas((prev) => prev.filter((fila) => fila.idDetalle !== idDetalle));
    } catch (err) {
      console.error("Error al marcar detalle como listo", err);
      setError("No se pudo marcar el detalle como listo.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Órdenes en Cocina - Administrador</h2>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {mensaje && <Alert variant="success">{mensaje}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover className="cocina-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Cantidad</th>
              <th>Menú</th>
              <th>Hora de Entrega</th>
              <th>Observaciones</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.idDetalle}>
                <td className="text-center">{fila.cliente}</td>
                <td>{fila.cantidad}</td>
                <td>{fila.menu}</td>
                <td>
                  {new Date(fila.horaEntrega).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>{fila.nota || "-"}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => marcarDetalleComoListo(fila.idDetalle)}
                  >
                    Marcar como Listo
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminCocinaPage;
