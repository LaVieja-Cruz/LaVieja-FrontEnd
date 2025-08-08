import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CrearProveedor = () => {
  const navigate = useNavigate();
  const [modo, setModo] = useState("cliente"); // "cliente" o "manual"
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [error, setError] = useState(null);

  const [idClienteSeleccionado, setIdClienteSeleccionado] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Client/GetAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setClientes(data);
      } catch (err) {
        setError("Error al cargar clientes: " + err.message);
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    try {
      if (modo === "cliente") {
        if (!idClienteSeleccionado) {
          setError("Debes seleccionar un cliente existente.");
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/Proveedor/crear-desde-cliente/${idClienteSeleccionado}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(await res.text());
      } else {
        // modo === "manual"
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Proveedor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error(await res.text());
      }

      navigate("/proveedores");
    } catch (err) {
      console.error(err);
      setError("Error al crear proveedor: " + err.message);
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-personalized text-white">
          <h4 className="mb-0">Agregar Proveedor</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Elección de modo */}
            <Row className="mb-4">
              <Col md={6}>
                <Form.Check
                  type="radio"
                  label="Crear a partir de cliente existente"
                  checked={modo === "cliente"}
                  onChange={() => setModo("cliente")}
                  inline
                />
                <Form.Check
                  type="radio"
                  label="Crear proveedor manualmente"
                  checked={modo === "manual"}
                  onChange={() => setModo("manual")}
                  inline
                />
              </Col>
            </Row>

            {/* Si elige cliente existente */}
            {modo === "cliente" && (
              <Row className="mb-3">
                <Col md={6}>
                  {loadingClientes ? (
                    <Spinner animation="border" />
                  ) : (
                    <Form.Group controlId="idCliente">
                      <Form.Label>Seleccionar Cliente</Form.Label>
                      <Form.Select
                        value={idClienteSeleccionado ?? ""}
                        onChange={(e) =>
                          setIdClienteSeleccionado(
                            e.target.value === "" ? null : parseInt(e.target.value)
                          )
                        }
                      >
                        <option value="">-- Seleccionar --</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.idCliente} value={cliente.idCliente}>
                            {cliente.nombre} {cliente.apellido}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}
                </Col>
              </Row>
            )}

            {/* Si elige creación manual */}
            {modo === "manual" && (
              <>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="nombre">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={(e) =>
                          setFormData({ ...formData, nombre: e.target.value })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="telefono">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={(e) =>
                          setFormData({ ...formData, telefono: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="direccion">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={(e) =>
                          setFormData({ ...formData, direccion: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            <div className="text-end mt-4">
              <Button type="submit" className="bg-personalized">
                Guardar Proveedor
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CrearProveedor;
