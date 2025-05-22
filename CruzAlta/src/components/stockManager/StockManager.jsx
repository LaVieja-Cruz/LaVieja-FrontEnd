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
  const [editandoTipo, setEditandoTipo] = useState(null); // "comida" o "menu"
  const [editandoItem, setEditandoItem] = useState(null); // objeto a editar
  const [showEditarModal, setShowEditarModal] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  //LIMPIAR NUEVO MENU MODAL
  const formularioMenuVacio = {
  nombre: "",
  descripcion: "",
  precio: 0,
  stock: 0,
  idRestaurante: 1,
  imagenUrl: "/images/logo-png.png",
  idComidas: [],
  activo: true
};

//LIMPIAR MODAL NUEVA COMIDAS
const formularioComidaVacio = {
  comida: "",
  codComida: 0,
  precio: 0,
  stock: 0,
  activo: true,
  imagenUrl: "/images/logo-png.png"
};

  const [nuevoMenu, setNuevoMenu] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    activo: true,
    stock: 0,
    idRestaurante: 1,
    imagenUrl: "/images/logo-png.png",
    idComidas: [],
  });

  const [showComidaModal, setShowComidaModal] = useState(false);

const [nuevaComida, setNuevaComida] = useState({
  comida: "",
  codComida: 0,
  stock: 0,
  precio: 0,
  activo: true,
  imagenUrl: "/images/logo-png.png"
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


  const eliminarItem = async (tipo, id) => {
  if (!window.confirm("¿Estás seguro de que querés eliminar este ítem?")) return;

  const token = localStorage.getItem("jwtToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const endpoint =
    tipo === "comida"
      ? `https://localhost:7042/api/Comidas/Delete/${id}`
      : `https://localhost:7042/api/Menus/${id}`;;

  try {
    const resp = await fetch(endpoint, { method: "DELETE", headers });
    if (resp.ok) {
      showToast(`${tipo === "comida" ? "Comida" : "Menú"} eliminado correctamente`, "success");

      // actualizar data
      const [comidasRes, menusRes] = await Promise.all([
        fetch("https://localhost:7042/api/Comidas/GetAll", { headers }),
        fetch("https://localhost:7042/api/Menus", { headers }),
      ]);
      if (comidasRes.ok) setComidas(await comidasRes.json());
      if (menusRes.ok) setMenus(await menusRes.json());
    } else {
      showToast("Error al eliminar", "danger");
    }
  } catch {
    showToast("Error de red al eliminar", "danger");
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
        setNuevoMenu(formularioMenuVacio);
        setShowModal(false);
        const menusResp = await fetch("https://localhost:7042/api/Menus", { headers });
        if (menusResp.ok) {
          const nuevosMenus = await menusResp.json();
          setMenus(nuevosMenus);

          // 🔁 Actualizar stockData con los menús
          setStockData((prev) => {
            const nuevosStocks = { ...prev };
            nuevosMenus.forEach((m) => {
              nuevosStocks[`menu-${m.idMenu}`] = m.stock ?? 0;
            });
            return nuevosStocks;
          });
        }
      } else {
        showToast("Error al crear el menú", "danger");
      }
    } catch {
      showToast("Error al conectar con el servidor", "danger");
    }
  };

  if (loading) return <Spinner animation="border" className="m-5" />;

  const crearNuevaComida = async () => {
  const { comida, codComida, precio, stock } = nuevaComida;
  if (!nuevaComida.comida) {
  showToast("El nombre de la comida es obligatorio", "danger");
  return;
}


  const token = localStorage.getItem("jwtToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const resp = await fetch("https://localhost:7042/api/Comidas/Add", {
      method: "POST",
      headers,
      body: JSON.stringify({
      comida: nuevaComida.comida,
      codComida: 0,
      precio: 0,
      stock: 0,
      activo: nuevaComida.activo,
      imagenUrl: "/images/logo-png.png"
    }),

});


    if (resp.ok) {
      showToast("Comida creada correctamente", "success");
      setNuevaComida(formularioComidaVacio);  
      setShowComidaModal(false);
      const comidasResp = await fetch("https://localhost:7042/api/Comidas/GetAll", { headers });
      if (comidasResp.ok) setComidas(await comidasResp.json());
    } else {
      showToast("Error al crear comida", "danger");
    }
  } catch {
    showToast("Error al conectar con el servidor", "danger");
  }
};


  return (
    <div className="p-4">
      <div className="d-flex justify-content-center mb-3">
        <Button className="colorbutton me-2" onClick={() => setShowComidaModal(true)}>
  Añadir Comida
</Button>
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
        <th>Estado</th>
        <th>Actualizar</th>
      </tr>
    </thead>
    <tbody>
      {[...comidas]
        .sort((a, b) => {
          if (a.activo !== b.activo) return a.activo ? -1 : 1;
          return a.comida.localeCompare(b.comida);
        }).map((c) => (
          <tr key={`comida-${c.idComida}`}>
            <td>{c.comida}</td>
            <td>{c.activo ? "Activo" : "Inactivo"}</td>
            <td>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant={c.activo ? "outline-danger" : "outline-success"}
                  onClick={() => toggleActivo("comida", c.idComida, c.activo)}
                >
                  {c.activo ? "Desactivar" : "Activar"}
                </Button>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => {
                    const comidaActual = comidas.find(x => x.idComida === c.idComida);
                    setEditandoTipo("comida");
                    setEditandoItem({ ...comidaActual });
                    setShowEditarModal(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => eliminarItem("comida", c.idComida)}
                >
                  Eliminar
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
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Actualizar</th>
        </tr>
      </thead>
      <tbody>
        {[...menus]
          .sort((a, b) => {
            if (a.activo !== b.activo) return a.activo ? -1 : 1;
            return a.nombre.localeCompare(b.nombre);
          }).map((m) => (
            <tr key={`menu-${m.idMenu}`}>
              <td>{m.nombre}</td>
              <td>${m.precio}</td>
              <td>
                <FormControl
                  type="number"
                  value={stockData[`menu-${m.idMenu}`] || ""}
                  readOnly
                  style={{ width: "80px" }}
                />
              </td>
              <td>{m.activo ? "Activo" : "Inactivo"}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant={m.activo ? "outline-danger" : "outline-success"}
                    onClick={() => toggleActivo("menu", m.idMenu, m.activo)}
                  >
                    {m.activo ? "Desactivar" : "Activar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => {
                      const menuActual = menus.find(x => x.idMenu === m.idMenu);
                      const stockActual = stockData[`menu-${m.idMenu}`];
                      setEditandoTipo("menu");
                      setEditandoItem({ ...menuActual, stock: stockActual });
                      setShowEditarModal(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => eliminarItem("menu", m.idMenu)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  </Col>
</Row>


      <ToastContainer  className="position-fixed top-50 start-50 translate-middle"
        style={{ zIndex: 9999 }}>
        <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })}>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={showEditarModal} onHide={() => setShowEditarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar {editandoTipo === "comida" ? "Comida" : "Menú"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editandoItem && (
  <Form>
  <Form.Group className="mb-2">
    <Form.Label>Nombre</Form.Label>
    <Form.Control
      type="text"
      value={editandoItem.comida || editandoItem.nombre}
      onChange={(e) =>
        setEditandoItem({
          ...editandoItem,
          comida: editandoTipo === "comida" ? e.target.value : undefined,
          nombre: editandoTipo === "menu" ? e.target.value : undefined,
        })
      }
    />
  </Form.Group>

  {editandoTipo === "comida" && (
    <Form.Group className="mb-3">
      <Form.Check
        type="checkbox"
        label="Activo"
        checked={editandoItem.activo}
        onChange={(e) =>
          setEditandoItem({
            ...editandoItem,
            activo: e.target.checked,
          })
        }
      />
    </Form.Group>
  )}

  {editandoTipo === "menu" && (
    <>
      <Form.Group className="mb-2">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          type="text"
          value={editandoItem.descripcion}
          onChange={(e) =>
            setEditandoItem({ ...editandoItem, descripcion: e.target.value })
          }
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Precio</Form.Label>
        <Form.Control
          type="number"
          value={editandoItem.precio}
          onChange={(e) =>
            setEditandoItem({ ...editandoItem, precio: parseFloat(e.target.value) })
          }
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Stock</Form.Label>
        <Form.Control
          type="number"
          value={editandoItem.stock}
          onChange={(e) =>
            setEditandoItem({ ...editandoItem, stock: parseInt(e.target.value) })
          }
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="Activo"
          checked={editandoItem.activo}
          onChange={(e) =>
            setEditandoItem({ ...editandoItem, activo: e.target.checked })
          }
        />
      </Form.Group>
    </>
  )}

  <div className="d-flex justify-content-end mt-3">
    <Button variant="secondary" className="me-2" onClick={() => {setNuevoMenu(formularioMenuVacio); setShowEditarModal(false)}}>
      Cancelar
    </Button>
    <Button variant="primary" onClick={async () => {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      let endpoint = "";
      let payload = {};

      if (editandoTipo === "comida") {
        endpoint = `https://localhost:7042/api/Comidas/Update/${editandoItem.idComida}`;
        payload = {
          comida: editandoItem.comida,
          codComida: editandoItem.codComida ?? 0,
          activo: editandoItem.activo ?? true,
          precio: 0 // si tu backend lo requiere
        };
      } else {
        endpoint = `https://localhost:7042/api/Menus/${editandoItem.idMenu}`;
        payload = {
          idMenu: editandoItem.idMenu,
          nombre: editandoItem.nombre,
          descripcion: editandoItem.descripcion,
          precio: editandoItem.precio,
          stock: editandoItem.stock,
          idRestaurante: editandoItem.idRestaurante,
          activo: editandoItem.activo,
          imagenUrl: editandoItem.imagenUrl,
          idComidas: editandoItem.idComidas ?? []
        };
      }

      try {
        const resp = await fetch(endpoint, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });

        if (resp.ok) {
          showToast(`${editandoTipo === "comida" ? "Comida" : "Menú"} actualizado`, "success");
          setShowEditarModal(false);

          const [comidasRes, menusRes] = await Promise.all([
            fetch("https://localhost:7042/api/Comidas/GetAll", { headers }),
            fetch("https://localhost:7042/api/Menus", { headers }),
          ]);

          const comidasData = comidasRes.ok ? await comidasRes.json() : [];
          const menusData = menusRes.ok ? await menusRes.json() : [];

          setComidas(comidasData);
          setMenus(menusData);

          const nuevoStockData = {};
          comidasData.forEach((c) => {
            nuevoStockData[`comida-${c.idComida}`] = c.stock ?? 0;
          });
          menusData.forEach((m) => {
            nuevoStockData[`menu-${m.idMenu}`] = m.stock ?? 0;
          });
          setStockData(nuevoStockData);

        } else {
          showToast("Error al actualizar", "danger");
        }
      } catch {
        showToast("Error de red al actualizar", "danger");
      }
    }}>
      Guardar
    </Button>
  </div>
</Form>

          )}
        </Modal.Body>
      </Modal>



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
                options={comidas
                  .filter((c) => c.activo) //  Solo comidas activas
                  .map((c) => ({ value: c.idComida, label: c.comida }))
                }
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
              <Button variant="secondary" className="me-2" onClick={() => {setNuevoMenu(formularioMenuVacio); setShowModal(false)}}>
                Cancelar
              </Button>
              <Button onClick={crearNuevoMenu}>Guardar</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showComidaModal} onHide={() => setShowComidaModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Nueva Comida</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-2">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          value={nuevaComida.comida}
          onChange={(e) => setNuevaComida({ ...nuevaComida, comida: e.target.value })}
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="Activo"
          checked={nuevaComida.activo}
          onChange={(e) => setNuevaComida({ ...nuevaComida, activo: e.target.checked })}
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={() => { setNuevoMenu(formularioMenuVacio); setShowComidaModal(false)}}>
          Cancelar
        </Button>
        <Button onClick={crearNuevaComida}>Guardar</Button>
      </div>
    </Form>
  </Modal.Body>
</Modal>

    </div>
  );
};

export default StockManager;
