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
import { useParams, useNavigate } from "react-router-dom";

const EditarProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    idCliente: null,
  });

  const [clienteAsociado, setClienteAsociado] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");
  const [clientes, setClientes] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProveedor = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Proveedor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setFormData({
        nombre: data.nombre,
        telefono: data.telefono ?? "",
        direccion: data.direccion ?? "",
        idCliente: data.idCliente ?? null,
      });
      setClienteAsociado(data.idCliente !== null);
      setNombreCliente(data.nombreCliente ?? "");
    } catch (err) {
      console.error(err);
      setError("Error al cargar el proveedor: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Client/GetAll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setClientes(data);
    } catch (e) {
      console.error("Error al traer clientes:", e);
    }
  };

  useEffect(() => {
    getProveedor();
    fetchClientes();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "idCliente" && value === "" ? null : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Proveedor/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          idCliente: formData.idCliente === "" ? null : parseInt(formData.idCliente),
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      navigate("/proveedores");
    } catch (err) {
      console.error(err);
      setError("Error al actualizar proveedor: " + err.message);
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="shadow-sm">
        <Card.Header className="bg-personalized text-white">
          <h4 className="mb-0">Editar Proveedor</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    required
                    value={formData.nombre}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="idCliente">
                  <Form.Label>Cliente Asociado</Form.Label>

                  {clienteAsociado ? (
                    <>
                      <Form.Control
                        type="text"
                        value={nombreCliente}
                        readOnly
                        className="text-muted"
                      />
                      <Form.Check
                        className="mt-2"
                        type="checkbox"
                        label="Desvincular cliente"
                        checked={formData.idCliente === null}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            idCliente: prev.idCliente === null ? "restaurar" : null,
                          }))
                        }
                      />
                    </>
                  ) : (
                    <>
                      <Form.Check
                        type="checkbox"
                        label="¿Desea vincular un cliente?"
                        checked={mostrarDropdown}
                        onChange={() => setMostrarDropdown((prev) => !prev)}
                      />
                      {mostrarDropdown && (
                        <Form.Select
                          name="idCliente"
                          value={formData.idCliente ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              idCliente:
                                e.target.value === "" ? null : parseInt(e.target.value),
                            })
                          }
                        >
                          <option value="">-- No asociado --</option>
                          {clientes.map((c) => (
                            <option key={c.idCliente} value={c.idCliente}>
                              {c.nombre} {c.apellido}
                            </option>
                          ))}
                        </Form.Select>
                      )}
                    </>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="text-end">
              <Button type="submit" className="bg-personalized">
                Guardar Cambios
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditarProveedor;
