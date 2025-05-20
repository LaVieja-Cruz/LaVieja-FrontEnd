import React, { useEffect, useState } from "react";
import {
  Table,
  FormControl,
  Button,
  Spinner,
  Toast,
  ToastContainer,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import Select from "react-select";

const StockManager = () => {
  const [comidas, setComidas] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  const [nuevoMenu, setNuevoMenu] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    activo: true,
    stock: 0,
    idRestaurante: 1,
    imagenUrl: "/images/nuevo.png",
    idComidas: [],
  });

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const [comidasRes, menusRes] = await Promise.all([
          fetch("https://localhost:7042/api/Comidas/GetAll", { headers }),
          fetch("https://localhost:7042/api/Menus", { headers }),
        ]);

        const comidasData = comidasRes.ok ? await comidasRes.json() : [];
        const menusData = menusRes.ok ? await menusRes.json() : [];

        setComidas(comidasData);
        setMenus(menusData);

        const stockInicial = {};
        comidasData.forEach((c) => (stockInicial[`comida-${c.idComida}`] = c.stock ?? 0));
        menusData.forEach((m) => (stockInicial[`menu-${m.idMenu}`] = m.stock ?? 0));
        setStockData(stockInicial);
      } catch (error) {
        showToast("Error al cargar datos desde el servidor", "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStockChange = (key, value) => {
    setStockData((prev) => ({ ...prev, [key]: value }));
  };

  const actualizarStock = async (tipo, id) => {
    const key = `${tipo}-${id}`;
    const nuevoStock = parseInt(stockData[key]);
    if (isNaN(nuevoStock)) return;

    const token = localStorage.getItem("jwtToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const body = JSON.stringify({ id, nuevoStock });
    const endpoint =
      tipo === "comida"
        ? `https://localhost:7042/api/Comidas/actualizar-stock/${id}`
        : `https://localhost:7042/api/Menus/actualizar-stock/${id}`;

    try {
      const resp = await fetch(endpoint, { method: "PUT", headers, body });
      if (resp.ok) {
        showToast(`Stock actualizado para ${tipo} ID ${id}`, "success");
      } else {
        showToast("Error al actualizar stock", "danger");
      }
    } catch {
      showToast("Error al conectar con el servidor", "danger");
    }
  };

  const toggleActivo = async (tipo, id, estadoActual) => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const endpoint =
      tipo === "comida"
        ? `https://localhost:7042/api/Comidas/toggle-activo/${id}`
        : `https://localhost:7042/api/Menus/toggle-activo/${id}`;

    try {
      const resp = await fetch(endpoint, { method: "PUT", headers });
      if (resp.ok) {
        showToast(`${tipo} ${id} ahora está ${!estadoActual ? "activo" : "inactivo"}`, "success");

        // recargar data
        const comidasRes = await fetch("https://localhost:7042/api/Comidas/GetAll", { headers });
        const menusRes = await fetch("https://localhost:7042/api/Menus", { headers });
        if (comidasRes.ok) setComidas(await comidasRes.json());
        if (menusRes.ok) setMenus(await menusRes.json());
      } else {
        showToast(`Error al cambiar estado de ${tipo}`, "danger");
      }
    } catch {
      showToast("Error al conectar con el servidor", "danger");
    }
  };

  const crearNuevoMenu = async () => {
    const { nombre, descripcion, precio, stock, idRestaurante, idComidas } = nuevoMenu;
    if (!nombre || !descripcion || !precio || !stock || !idRestaurante || idComidas.length === 0) {
      showToast("Por favor completá todos los campos requeridos", "danger");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const resp = await fetch("https://localhost:7042/api/Menus", {
        method: "POST",
        headers,
        body: JSON.stringify(nuevoMenu),
      });

      if (resp.ok) {
        showToast("Menú creado correctamente", "success");
        setShowModal(false);
        const menusResp = await fetch("https://localhost:7042/api/Menus", { headers });
        if (menusResp.ok) setMenus(await menusResp.json());
      } else {
        showToast("Error al crear el menú", "danger");
      }
    } catch {
      showToast("Error al conectar con el servidor", "danger");
    }
  };

  if (loading) return <Spinner animation="border" className="m-5" />;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-center mb-3">
        <Button className="colorbutton" onClick={() => setShowModal(true)}>
          Añadir Menú
        </Button>
      </div>
      <div>
        <h3>Administrar Stock</h3>
      </div>

      <Row>
        <Col xs={12} md={6}>
          <h5 className="text-center">Comidas</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Actualizar</th>
              </tr>
            </thead>
            <tbody>
              {comidas.map((c) => (
                <tr key={`comida-${c.idComida}`}>
                  <td>{c.comida}</td>
                  <td>
                    <FormControl
                      type="number"
                      value={stockData[`comida-${c.idComida}`] || ""}
                      onChange={(e) => handleStockChange(`comida-${c.idComida}`, e.target.value)}
                    />
                  </td>
                  <td>{c.activo ? "Activo" : "Inactivo"}</td>

                  <td>
                    <div className="d-flex gap-2">
                      <Button size="sm" className="colorbutton" onClick={() => actualizarStock("comida", c.idComida)}>
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant={c.activo ? "outline-danger" : "outline-success"}
                        onClick={() => toggleActivo("comida", c.idComida, c.activo)}
                      >
                        {c.activo ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col xs={12} md={6}>
          <h5 className="text-center">Menús</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Actualizar</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((m) => (
                <tr key={`menu-${m.idMenu}`}>
                  <td>{m.nombre}</td>
                  <td>
                    <FormControl
                      type="number"
                      value={stockData[`menu-${m.idMenu}`] || ""}
                      onChange={(e) => handleStockChange(`menu-${m.idMenu}`, e.target.value)}
                    />
                  </td>
                  <td>{m.activo ? "Activo" : "Inactivo"}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button size="sm" className="colorbutton" onClick={() => actualizarStock("menu", m.idMenu)}>
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant={m.activo ? "outline-danger" : "outline-success"}
                        onClick={() => toggleActivo("menu", m.idMenu, m.activo)}
                      >
                        {m.activo ? "Desactivar" : "Activar"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })}>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Menú</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nuevoMenu.nombre}
                onChange={(e) => setNuevoMenu({ ...nuevoMenu, nombre: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                value={nuevoMenu.descripcion}
                onChange={(e) => setNuevoMenu({ ...nuevoMenu, descripcion: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={nuevoMenu.precio}
                onChange={(e) => setNuevoMenu({ ...nuevoMenu, precio: parseFloat(e.target.value) })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={nuevoMenu.stock}
                onChange={(e) => setNuevoMenu({ ...nuevoMenu, stock: parseInt(e.target.value) })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Comidas asociadas</Form.Label>
              <Select
                isMulti
                options={comidas.map((c) => ({ value: c.idComida, label: c.comida }))}
                onChange={(selected) =>
                  setNuevoMenu({ ...nuevoMenu, idComidas: selected.map((s) => s.value) })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Activo"
                checked={nuevoMenu.activo}
                onChange={(e) => setNuevoMenu({ ...nuevoMenu, activo: e.target.checked })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={crearNuevoMenu}>Guardar</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StockManager;
