import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Spinner,
  Alert,
  Toast,
  Modal,
  Form,
} from "react-bootstrap";
import ItemCard from "../itemCard/ItemCard";
import { FaShoppingCart } from "react-icons/fa";
import "./Pedidos.css";
import Select from "react-select";

const Pedidos = () => {
  const [comidas, setComidas] = useState([]);
  const [menus, setMenus] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [deliverySeleccionado, setDeliverySeleccionado] = useState(null);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    direccion1: "",
    telefono: "",
    esProveedor: false,
  });
  const [mostrarFormularioCliente, setMostrarFormularioCliente] =
    useState(false);
  const [notaModal, setNotaModal] = useState({
    show: false,
    index: null,
    nota: "",
  });

  const { role } = useAuth();

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showPopup = (message, variant = "success") => {
    setPopup({ show: true, message, variant });
    setTimeout(() => {
      setPopup({ show: false, message: "", variant });
    }, 4000);
  };

  const fetchMenus = async () => {
    const token = localStorage.getItem("jwtToken");
    const res = await fetch("https://localhost:7042/api/Menus", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Error al cargar menús");
    return await res.json();
  };

  const fetchComidas = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("https://localhost:7042/api/Comidas/GetAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Error al cargar comidas");
    return await res.json();
  };
  const fetchClientes = async () => {
    const token = localStorage.getItem("jwtToken");
    const res = await fetch("https://localhost:7042/api/Client/GetAll", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Error al cargar clientes");
    return await res.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menusData, comidasData, clientesData] = await Promise.all([
          fetchMenus(),
          fetchComidas(),
          fetchClientes(),
        ]);
        setMenus(menusData);
        setComidas(comidasData);
        setClientes(clientesData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar menús o comidas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const agregarAlPedido = (item) => {
    if (!item || typeof item.precio !== "number") return;
    setPedido((prev) => [...prev, item]);
  };

  const eliminarDelPedido = (index) => {
    setPedido((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = pedido.reduce((sum, item) => {
    if (!item || typeof item.precio !== "number") return sum;
    return sum + item.precio;
  }, 0);

  const cargarPedido = async () => {
    if (pedido.length === 0) {
      showPopup("Debes agregar al menos una comida o menú.", "danger");
      return;
    }
    if (!clienteSeleccionado) {
      showPopup(
        "Debes seleccionar un cliente antes de confirmar el pedido.",
        "danger"
      );
      return;
    }

    const now = new Date();
    const HoraEntrega = new Date(now.getTime() + 60 * 60 * 1000);

    const detalles = pedido.map((item) => ({
      idMenu: item.tipo === "menu" ? item.id : null,
      idComida: item.tipo === "comida" ? item.id : null,
      nota: item.nota || "",
    }));

    const dto = {
  FechaPedido: now.toISOString(),
  HoraPedido: now.toISOString(),
  HoraEntrega: HoraEntrega.toISOString(),
  idCliente: clienteSeleccionado,
  idDelivery: deliverySeleccionado,
  Estado: 0,
  MetodoEntrega: 1,
  detallesPedidos: detalles,
};
if (!deliverySeleccionado) {
  showPopup("Debes seleccionar un delivery.", "danger");
  return;
}


    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch("https://localhost:7042/api/Pedido/Add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });

      if (!res.ok) throw new Error(await res.text());

      showPopup("Pedido cargado con éxito", "success");
      setPedido([]);
    } catch (err) {
      console.error(err);
      showPopup("Error al cargar el pedido: " + err.message, "danger");
    }
  };

  if (loading)
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  const obtenerNombreCliente = (id) => {
    const cliente = clientes.find((c) => c.idCliente === id);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : "";
  };

  const agregarNota = (index) => {
    const notaExistente = pedido[index]?.nota || "";
    setNotaModal({ show: true, index, nota: notaExistente });
  };

  const guardarNota = () => {
    setPedido((prevPedido) =>
      prevPedido.map((item, idx) =>
        idx === notaModal.index ? { ...item, nota: notaModal.nota } : item
      )
    );
    setNotaModal({ show: false, index: null, nota: "" });
  };

  const comidasActivas = comidas.filter(
    (c) => c.activo === true || c.activo === 1
  );
  const menusActivos = menus.filter((m) => m.activo === true || m.activo === 1);
  return (
    <Container fluid>
      <h2 className="my-4 titulo text-center">Realizar Pedido</h2>
      <Row>
        {/* Columna de Menus y Comidas */}
        <Col md={8}>
          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm">
                <Card.Header className="bg-personalized text-white">
                  <h5 className="mb-0">Menús Disponibles</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {menusActivos.map((menu) => (
                      <Col
                        key={menu.idMenu}
                        xs={12}
                        md={6}
                        lg={4}
                        className="mb-3"
                      >
                        <ItemCard
                          item={{
                            id: menu.idMenu,
                            nombre: menu.nombre,
                            precio: menu.precio ?? 0,
                            imagenUrl: menu.imagenUrl,
                          }}
                          onAgregarAlPedido={() =>
                            agregarAlPedido({
                              id: menu.idMenu,
                              nombre: menu.nombre ?? "Sin nombre",
                              precio: menu.precio ?? 0,
                              tipo: "menu",
                            })
                          }
                        />
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="shadow-sm">
                <Card.Header className="bg-personalized text-white">
                  <h5 className="mb-0">Comidas Disponibles</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {comidasActivas.map((comida) => (
                      <Col
                        key={comida.idComida}
                        xs={12}
                        md={6}
                        lg={4}
                        className="mb-3"
                      >
                        <ItemCard
                          item={{
                            id: comida.idComida,
                            nombre: comida.comida,
                            precio: comida.precio ?? 0,
                            imagenUrl: comida.imagenUrl,
                          }}
                          onAgregarAlPedido={() =>
                            agregarAlPedido({
                              id: comida.idComida,
                              nombre: comida.comida ?? "Sin nombre",
                              precio: comida.precio ?? 0,
                              tipo: "comida",
                            })
                          }
                        />
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          <Card className="shadow mb-4 md-4 ">
            <Card.Header className="bg-personalized text-white">
              Seleccionar Cliente
            </Card.Header>
            <Card.Body>
              <Select
                className="mb-3"
                options={[
                  ...clientes.map((cliente) => ({
                    value: cliente.idCliente,
                    label: `${cliente.nombre} ${cliente.apellido}`,
                  })),
                  { value: "nuevo", label: "Agregar nuevo cliente" },
                ]}
                placeholder="Selecciona un cliente..."
                onChange={(selectedOption) => {
                  if (!selectedOption) return;

                  if (selectedOption.value === "nuevo") {
                    setMostrarFormularioCliente(true);
                  } else {
                    setClienteSeleccionado(selectedOption.value);
                    setMostrarFormularioCliente(false);
                  }
                }}
                value={
                  clienteSeleccionado
                    ? {
                        value: clienteSeleccionado,
                        label: obtenerNombreCliente(clienteSeleccionado),
                      }
                    : null
                }
              />

              {mostrarFormularioCliente && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="form-control mb-2"
                    value={nuevoCliente.nombre}
                    onChange={(e) =>
                      setNuevoCliente({
                        ...nuevoCliente,
                        nombre: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    className="form-control mb-2"
                    value={nuevoCliente.apellido}
                    onChange={(e) =>
                      setNuevoCliente({
                        ...nuevoCliente,
                        apellido: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Dirección"
                    className="form-control mb-2"
                    value={nuevoCliente.direccion1}
                    onChange={(e) =>
                      setNuevoCliente({
                        ...nuevoCliente,
                        direccion1: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Teléfono"
                    className="form-control mb-2"
                    value={nuevoCliente.telefono}
                    onChange={(e) =>
                      setNuevoCliente({
                        ...nuevoCliente,
                        telefono: e.target.value,
                      })
                    }
                  />
                  <Button
                    className="buttoncolor"
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("jwtToken");
                        const res = await fetch(
                          "https://localhost:7042/api/Cliente",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(nuevoCliente),
                          }
                        );
                        if (!res.ok) throw new Error(await res.text());

                        const createdCliente = await res.json();
                        showPopup("Cliente creado correctamente");
                        setClientes([...clientes, createdCliente]);
                        setClienteSeleccionado(createdCliente.idCliente);
                        setMostrarFormularioCliente(false);
                      } catch (err) {
                        console.error(err);
                        showPopup(
                          "Error al crear cliente: " + err.message,
                          "danger"
                        );
                      }
                    }}
                  >
                    Guardar Cliente
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
          <Card className="shadow mb-4">
  <Card.Header className="bg-personalized text-white">
    Seleccionar Delivery
  </Card.Header>
  <Card.Body>
    <Form.Select
      value={deliverySeleccionado || ""}
      onChange={(e) => setDeliverySeleccionado(Number(e.target.value))}
    >
      <option value="">Selecciona un delivery...</option>
      <option value={1}>Delivery 1</option>
      <option value={2}>Delivery 2</option>
    </Form.Select>
  </Card.Body>
</Card>


          {/* Columna de resumen */}

          <Card className="shadow">
            <Card.Header className="bg-personalized text-white">
              Resumen del Pedido
            </Card.Header>
            <Card.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
              {pedido.length === 0 ? (
                <p className="text-muted">
                  No hay comidas ni menús en el pedido.
                </p>
              ) : (
                <ListGroup>
                  {pedido.map((item, idx) => (
                    <ListGroup.Item
                      key={`${item.id}-${idx}`}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{item.nombre}</strong>{" "}
                        {typeof item.precio === "number"
                          ? `($${item.precio.toFixed(2)})`
                          : "(Precio no disponible)"}
                      </div>
                      {item.nota && (
                        <div className="text-muted small mt-1">
                          <em>Nota: {item.nota}</em>
                        </div>
                      )}
                      <Button
                        className="colorbutton"
                        size="sm"
                        onClick={() => agregarNota(idx)}
                      >
                        Agregar Nota
                      </Button>
                      <Button
                        className="colorbutton"
                        size="sm"
                        onClick={() => eliminarDelPedido(idx)}
                      >
                        ×
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between align-items-center">
                <strong>Total:</strong> <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button className="mt-3 w-100 colorbutton" onClick={cargarPedido}>
                <FaShoppingCart className="me-2" />
                Cargar Pedido
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Popup central */}
      {popup.show && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            minWidth: "300px",
          }}
        >
          <Toast
            bg={popup.variant}
            onClose={() => setPopup({ ...popup, show: false })}
            show={popup.show}
            delay={2000}
            autohide
          >
            <Toast.Body className="text-white text-center">
              {popup.message}
            </Toast.Body>
          </Toast>
        </div>
      )}
      <Modal
        show={notaModal.show}
        onHide={() => setNotaModal({ show: false, index: null, nota: "" })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="notaInput">
              <Form.Label>Nota para el ítem</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notaModal.nota}
                onChange={(e) =>
                  setNotaModal((prev) => ({ ...prev, nota: e.target.value }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setNotaModal({ show: false, index: null, nota: "" })}
          >
            Cancelar
          </Button>
          <Button className="colorbutton" onClick={guardarNota}>
            Guardar Nota
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Pedidos;
