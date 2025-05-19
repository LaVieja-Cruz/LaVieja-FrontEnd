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
} from "react-bootstrap";
import ItemCard from "../itemCard/ItemCard";
import { FaShoppingCart } from "react-icons/fa";
import './Pedidos.css';

const Pedidos = () => {
  const [comidas, setComidas] = useState([]);
  const [menus, setMenus] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

    const idMenus = pedido.filter((p) => p.tipo === "menu").map((p) => p.id);
    const idComidas = pedido.filter((p) => p.tipo === "comida").map((p) => p.id);

    const now = new Date();
    const HoraEntrega = new Date(now.getTime() + 60 * 60 * 1000);

    const dto = {
      FechaPedido: now.toISOString(),
      HoraPedido: now.toISOString(),
      HoraEntrega: HoraEntrega.toISOString(),
      idCliente: 1,
      idDelivery: null,
      Estado: 0,
      MetodoEntrega: 1,
      idMenus,
      idComidas,
    };

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
                    {menus.map((menu) => (
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
                    {comidas.map((comida) => (
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
                              nombre: comida.nombre ?? "Sin nombre",
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

        {/* Columna de resumen */}
        <Col md={4}>
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
                        <strong>{item.nombre}</strong>{" "}
                        {typeof item.precio === "number"
                          ? `($${item.precio.toFixed(2)})`
                          : "(Precio no disponible)"}
                      </div>
                      <Button
                        variant="outline-danger"
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
              <Button
                className="mt-3 w-100 colorbutton"
                onClick={cargarPedido}
              >
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
    </Container>
  );
};

export default Pedidos;
