import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import "./CocinaPage.css";

const AdminCocinaPage = () => {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);


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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Pedido/cocina`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setFilas(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error al obtener pedidos", err);
      setError("Error al cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const marcarDetalleComoListo = async (idDetalle) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/marcar-detalle-listo}/${idDetalle}`, null, {
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

  useEffect(() => {
  const interval = setInterval(() => {
    fetchPedidos();
  }, 5000); // cada 10 segundos refresco pagina automaticamente.
  

  return () => clearInterval(interval); // limpiar al desmontar
}, []);
const obtenerNombreMetodoPago = (valor) => {
  if (valor === "EfectivoTransferencia") return "Efectivo / Transferencia";
  if (valor === "CuentaCorriente") return "Cuenta Corriente";
  return "-";
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
              <th>Metodo de pago</th>
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
      <td>{obtenerNombreMetodoPago(fila.metodoPago)}</td>
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
