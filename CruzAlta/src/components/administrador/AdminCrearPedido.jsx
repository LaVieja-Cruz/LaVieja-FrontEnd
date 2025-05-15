import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import MenuCard from './MenuCard';





const AdminCrearPedido = () => {
  const [clientes, setClientes] = useState([]);
  const [menus, setMenus] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    cargarClientes();
    cargarMenus();
  }, []);

  const cargarClientes = async () => {
    const token = localStorage.getItem('token');

        const response = await axios.get('https://localhost:7042/api/Client/GetAll', {
        headers: {
            Authorization: `Bearer ${token}`
        }
        });

    setClientes(response.data);
  };

  const cargarMenus = async () => {
    const response = await axios.get('https://localhost:7042/api/Menus/GetAllConComidas');
    setMenus(response.data);
  };

  const agregarAlCarrito = (menu, cantidad, tamaño, comidas) => {
    const nuevo = {
      idMenu: menu.idMenu,
      nombre: menu.nombre,
      cantidad,
      tamaño,
      comidas: comidas.map(c => ({ idComida: c.idComida, nombre: c.nombre }))
    };
    setCarrito([...carrito, nuevo]);
  };

 const enviarPedido = async () => {
  const dto = {
    idCliente: parseInt(clienteSeleccionado),
    fechaPedido: new Date().toISOString(),
    horaPedido: new Date().toISOString(),
    metodoEntrega: 1, // o según tu lógica de entrega
    estado: 0, // ejemplo: "Pendiente"
    detalle: carrito.map(m => ({
      idMenu: m.idMenu,
      cantidad: m.cantidad,
      tamaño: m.tamaño,
      comidasSeleccionadas: m.comidas.map(c => c.idComida)
    }))
  };

  try {
    await axios.post('https://localhost:7042/api/Pedido/completo', dto);
    alert('✅ Pedido cargado correctamente');
    setCarrito([]);
  } catch (error) {
    console.error('❌ Error al enviar el pedido:', error);
    alert('Hubo un error al enviar el pedido. Verifica los datos o el servidor.');
  }
};


  return (
    <div className="container">
      <h2>Cargar Pedido Manual</h2>

      {/* Selección del cliente */}
      <Form.Group className="mb-3">
        <Form.Label>Cliente</Form.Label>
        <Form.Select onChange={e => setClienteSeleccionado(e.target.value)} value={clienteSeleccionado}>
          <option value="">-- Seleccione un cliente --</option>
          {clientes.map(cliente => (
            <option key={cliente.idCliente} value={cliente.idCliente}>
              {cliente.nombre} {cliente.apellido}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Menús disponibles */}
      <Row>
        {menus.map(menu => (
          <Col md={4} key={menu.idMenu}>
            <MenuCard menu={menu} onAgregar={agregarAlCarrito} />
          </Col>
        ))}
      </Row>

      {/* Resumen del pedido */}
      <h4 className="mt-4">Resumen del pedido</h4>
      <ul>
        {carrito.map((item, idx) => (
          <li key={idx}>
            {item.nombre} x{item.cantidad} ({item.tamaño}) - {item.comidas.map(c => c.nombre).join(', ')}
          </li>
        ))}
      </ul>

      <Button onClick={enviarPedido} disabled={!clienteSeleccionado || carrito.length === 0}>
        Confirmar Pedido
      </Button>
    </div>
  );
};

export default AdminCrearPedido;
