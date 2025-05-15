// Pedidos.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Spinner,
  Alert
} from 'react-bootstrap';
import ComidaCard from '../comidaCard/ComidaCard';

const Pedidos = () => {
  const [comidas, setComidas] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Traer comidas desde la API
  useEffect(() => {
    const fetchComidas = async () => {
      try {
        const token = localStorage.getItem('jwtToken'); // si usas JWT
        const resp = await fetch('https://localhost:7042/api/Comidas/GetAll', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined
          }
        });
        if (!resp.ok) throw new Error(`Error ${resp.status}`);
        const data = await resp.json();
        setComidas(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las comidas.');
      } finally {
        setLoading(false);
      }
    };

    fetchComidas();
  }, []);

  const agregarAlPedido = (comida) => {
    setPedido([...pedido, comida]);
  };

  const eliminarPedido = (index) => {
    const nuevo = [...pedido];
    nuevo.splice(index, 1);
    setPedido(nuevo);
  };

  // 2. Cargar pedido al backend (si ya lo tenías implementado)
  const cargarPedido = async () => {
    if (pedido.length === 0) {
      alert('No hay comidas en el pedido.');
      return;
    }

    const dto = {
      nombre: 'Pedido personalizado',
      descripcion: 'Pedido generado desde React',
      precio: 0, // calcular precio en backend o agregar lógica futura
      activo: true,
      stock: 1,
      idRestaurante: 1,
      idComidas: pedido.map((p) => p.id)
    };

    try {
      const token = localStorage.getItem('jwtToken');
      const resp = await fetch('https://localhost:7042/api/Menus/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined
        },
        body: JSON.stringify(dto)
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      alert('Pedido cargado exitosamente');
      setPedido([]);
    } catch (err) {
      console.error(err);
      alert('Hubo un error al cargar el pedido.');
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <h2 className="my-4">Crea tu Pedido</h2>
      <Row>
        {/* Listado de comidas */}
        <Col md={8}>
          <Row>
            {comidas.map((comida) => (
              <Col key={comida.id} xs="auto">
                <ComidaCard comida={comida} onAgregarAlPedido={agregarAlPedido} />
              </Col>
            ))}
          </Row>
        </Col>

        {/* Resumen y botón de carga */}
        <Col md={4}>
          <Card>
            <Card.Header>Resumen del Pedido</Card.Header>
            <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {pedido.length === 0 ? (
                <p>No hay comidas en el pedido.</p>
              ) : (
                <ListGroup>
                  {pedido.map((item, idx) => (
                    <ListGroup.Item key={`${item.id}-${idx}`}>
                      <div className="d-flex justify-content-between align-items-start">
                        <strong>{item.nombre}</strong>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => eliminarPedido(idx)}
                        >
                          ×
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
            <Button
              variant="success"
              className="m-2"
              onClick={cargarPedido}
            >
              Cargar Pedido
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Pedidos;
