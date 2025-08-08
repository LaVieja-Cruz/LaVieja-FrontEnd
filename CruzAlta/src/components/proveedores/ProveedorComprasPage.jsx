import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Spinner, Container, Button } from "react-bootstrap";

const ProveedorComprasPage = () => {
  const { idProveedor } = useParams();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Proveedor/detalles/${idProveedor}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // si usás JWT
          },
        });
        const data = await res.json();
        setCompras(data);
      } catch (error) {
        console.error("Error cargando compras:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, [idProveedor]);

  return (
    <Container className="mt-4">
      <h3>Detalle de Compras del Proveedor #{idProveedor}</h3>
      <Button className="mb-3" variant="secondary" onClick={() => navigate(-1)}>Volver</Button>

      {loading ? (
        <Spinner animation="border" />
      ) : compras.length === 0 ? (
        <p>No hay compras registradas para este proveedor.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Detalle</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((c) => (
              <tr key={c.idCompra}>
                <td>{new Date(c.fechaCompra).toLocaleString()}</td>
                <td>{c.detalle}</td>
                <td>${c.monto.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ProveedorComprasPage;
