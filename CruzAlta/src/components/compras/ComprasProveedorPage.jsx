// src/components/compras/ComprasProveedorPage.jsx
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";

const ComprasProveedorPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [idProveedor, setIdProveedor] = useState("");
  const [detalle, setDetalle] = useState("");
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await fetch("https://localhost:7042/api/Proveedor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProveedores(data);
      } catch (err) {
        setError("No se pudieron cargar los proveedores.");
      }
    };
    fetchProveedores();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);

    try {
      const response = await fetch("https://localhost:7042/api/CompraProveedor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idProveedor: parseInt(idProveedor),
          detalle,
          monto: parseFloat(monto),
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Error al registrar compra.");

      setMensaje("Compra registrada exitosamente.");
      setIdProveedor("");
      setDetalle("");
      setMonto("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Registrar Compra a Proveedor</h2>

      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Proveedor</Form.Label>
              <Form.Select
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                required
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((prov) => (
                  <option key={prov.idProveedor} value={prov.idProveedor}>
                    {prov.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Detalle</Form.Label>
              <Form.Control
                type="text"
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary">
          Registrar Compra
        </Button>
      </Form>
    </Container>
  );
};

export default ComprasProveedorPage;
