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
  const [horaEntrega, setHoraEntrega] = useState(null);
  const [deliverys, setDeliverys] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    direccion1: "",
    telefono: "",
    esProveedor: false,
  });
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false);
  const [notaModal, setNotaModal] = useState({ show: false, index: null, nota: "" });
  const [popup, setPopup] = useState({ show: false, message: "", variant: "success" });

  const { role } = useAuth();

  const generarOpcionesHorario = () => {
    const opciones = [];
    let hora = 20;
    let minutos = 0;
    while (hora < 23 || (hora === 23 && minutos === 0)) {
      const formato = `${hora.toString().padStart(2, "0")}:${minutos
        .toString()
        .padStart(2, "0")}`;
      opciones.push({ value: formato, label: formato });
      minutos += 15;
      if (minutos === 60) {
        minutos = 0;
        hora++;
      }
    }
    return opciones;
  };

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
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Error al cargar comidas");
    return await res.json();
  };

  const fetchClientesYDeliverys = async () => {
  const token = localStorage.getItem("jwtToken");

  // 1. Obtener clientes normales
  const resClientes = await fetch("https://localhost:7042/api/Client/GetAll", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!resClientes.ok) throw new Error("Error al cargar clientes");
  const clientesData = await resClientes.json();
  setClientes(clientesData);

  // 2. Obtener deliverys activos
  const resDeliverys = await fetch("https://localhost:7042/api/DeliveryActivo", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!resDeliverys.ok) throw new Error("Error al cargar deliverys activos");
  const deliverysData = await resDeliverys.json();

  // 3. Mapeamos para que cada delivery tenga idUsuario y userName
  const mapped = deliverysData.map(d => ({
    idUsuario: d.idUsuarioDelivery,
    userName: d.userName,
  }));
  setDeliverys(mapped);
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menusData, comidasData] = await Promise.all([
        fetchMenus(),
        fetchComidas(),
            ]);
      setMenus(menusData);
      setComidas(comidasData);
      await fetchClientesYDeliverys(); // Esto ya hace setClientes y setDeliverys internamente

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
      showPopup("Debes seleccionar un cliente.", "danger");
      return;
    }
    if (!deliverySeleccionado) {
      showPopup("Debes seleccionar un delivery.", "danger");
      return;
    }
    if (!horaEntrega) {
      showPopup("Debes seleccionar un horario de entrega.", "danger");
      return;
    }

    const now = new Date();
    const [h, m] = horaEntrega.split(":");
    const fechaEntrega = new Date();
    fechaEntrega.setHours(parseInt(h), parseInt(m), 0, 0);

    const dto = {
      FechaPedido: now.toISOString(),
      HoraPedido: now.toISOString(),
      HoraEntrega: fechaEntrega.toISOString(),
      idCliente: clienteSeleccionado,
      DeliveryIdUsuario: deliverySeleccionado,
      Estado: 0,
      MetodoEntrega: 1,
      detallesPedidos: pedido.map((item) => ({
        idMenu: item.tipo === "menu" ? item.id : null,
        idComida: item.tipo === "comida" ? item.id : null,
        nota: item.nota || "",
      })),
    };

    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch("https://localhost:7042/api/Pedido/Add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

  const comidasActivas = comidas.filter((c) => c.activo === true || c.activo === 1);
  const menusActivos = menus.filter((m) => m.activo === true || m.activo === 1);

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

  return (
    <Container fluid>
      <h2 className="my-4 titulo text-center">Realizar Pedido</h2>
      <Row>
        <Col md={8}>
          {/* Menús */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-personalized text-white">
              Menús Disponibles
            </Card.Header>
            <Card.Body>
              <Row>
                {menusActivos.map((menu) => (
                  <Col key={menu.idMenu} xs={12} md={6} lg={4} className="mb-3">
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

          {/* Comidas */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-personalized text-white">
              Comidas Disponibles
            </Card.Header>
            <Card.Body>
              <Row>
                {comidasActivas.map((comida) => (
                  <Col key={comida.idComida} xs={12} md={6} lg={4} className="mb-3">
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

        <Col md={4}>
          {/* CLIENTE (fila completa) */}
          <Row className="mb-3">
            <Col xs={12}>
              <Card className="shadow">
                <Card.Header className="bg-personalized text-white">Cliente</Card.Header>
                <Card.Body>
                  <Select
                    options={[
                      ...clientes.map((c) => ({
                        value: c.idCliente,
                        label: `${c.nombre} ${c.apellido}`,
                      })),
                      { value: "nuevo", label: "Agregar nuevo cliente" },
                    ]}
                    placeholder="Seleccionar..."
                    onChange={(option) => {
                      if (!option) return;
                      if (option.value === "nuevo") {
                        setMostrarFormularioCliente(true);
                      } else {
                        setClienteSeleccionado(option.value);
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
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* DELIVERY + HORARIO en misma fila (con botones iguales y toggle para delivery) */}
          <Row className="mb-3">
            <Col md={6}>
              <Card className="shadow h-100">
                <Card.Header className="bg-personalized text-white">Delivery</Card.Header>
                <Card.Body className="d-flex justify-content-center align-items-center">
                  <div className="btn-group w-100" role="group">
                    {deliverys.map((d) => (
                  <button
                    key={d.idUsuario}
                    type="button"
                    className={`btn btn-delivery ${deliverySeleccionado === d.idUsuario ? "selected" : ""}`}
                    onClick={() => setDeliverySeleccionado(d.idUsuario)}
                  >
                    {d.userName}
                  </button>
                ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow h-100">
                <Card.Header className="bg-personalized text-white">Horario de Entrega</Card.Header>
                <Card.Body className="d-flex align-items-center">
                  <div className="w-100">
                    <Select
                      options={generarOpcionesHorario()}
                      placeholder="Seleccionar horario..."
                      onChange={(option) => setHoraEntrega(option?.value)}
                      value={horaEntrega ? { value: horaEntrega, label: horaEntrega } : null}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>


          {/* Resumen del Pedido */}
          <Card className="shadow">
            <Card.Header className="bg-personalized text-white">Resumen del Pedido</Card.Header>
            <Card.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
              {pedido.length === 0 ? (
                <p className="text-muted">No hay comidas ni menús en el pedido.</p>
              ) : (
                <ListGroup>
                  {pedido.map((item, idx) => (
                    <ListGroup.Item
                      key={`${item.id}-${idx}`}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{item.nombre}</strong> (${item.precio.toFixed(2)})
                      </div>
                      <div className="d-flex gap-2">
                        <Button size="sm" onClick={() => agregarNota(idx)} className="colorbutton">
                          Nota
                        </Button>
                        <Button size="sm" onClick={() => eliminarDelPedido(idx)} className="colorbutton">
                          ×
                        </Button>
                      </div>
                    </ListGroup.Item>

                  ))}
                </ListGroup>
              )}
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between align-items-center">
                <strong>Total:</strong>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <Button className="mt-3 w-100 colorbutton" onClick={cargarPedido}>
                <FaShoppingCart className="me-2" /> Cargar Pedido
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Toast */}
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
            <Toast.Body className="text-white text-center">{popup.message}</Toast.Body>
          </Toast>
        </div>
      )}

      {/* Modal Nota */}
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
                  setNotaModal({ ...notaModal, nota: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setNotaModal({ show: false, index: null, nota: "" })}>
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
