import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await fetch("https://localhost:7042/api/Proveedor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setProveedores(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar proveedores.");
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  const proveedoresFiltrados = proveedores.filter((p) => {
    const nombreMatch = p.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const fecha = new Date(p.fechaAlta ?? new Date()); // fallback
    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta) : null;
    const fechaMatch = (!desde || fecha >= desde) && (!hasta || fecha <= hasta);
    return nombreMatch && fechaMatch;
  });

  const handleEditar = (id) => {
    navigate(`/proveedores/editar/${id}`);
  };

  return (
    <Container className="my-4">
      <h2 className="titulo text-center mb-4">Gestión de Proveedores</h2>

      <Card className="shadow-sm">
        <Card.Header className="bg-personalized text-white">
          <Row className="align-items-center">
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre"
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </Col>
            <Col md={3} className="text-end">
              <Button className="bg-personalized" onClick={() => navigate("/proveedores/crear")}>
                Agregar Proveedor
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table striped bordered responsive>
              <thead className="bg-personalized text-white">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Cliente Asociado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedoresFiltrados.map((p) => (
                  <tr key={p.idProveedor}>
                    <td>{p.idProveedor}</td>
                    <td>{p.nombre}</td>
                    <td>{p.telefono}</td>
                    <td>{p.direccion}</td>
                    <td>{p.nombreCliente ? p.nombreCliente : "-"}</td>
                    <td className="text-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditar(p.idProveedor)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={async () => {
                          const confirm = window.confirm("¿Estás seguro que deseas eliminar este proveedor?");
                          if (!confirm) return;

                          try {
                            const token = localStorage.getItem("jwtToken");
                            const res = await fetch(`https://localhost:7042/api/Proveedor/${p.idProveedor}`, {
                              method: "DELETE",
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            });
                            if (!res.ok) throw new Error(await res.text());
                            setProveedores((prev) => prev.filter((prov) => prov.idProveedor !== p.idProveedor));
                          } catch (err) {
                            alert("Error al eliminar proveedor: " + err.message);
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProveedoresPage;
