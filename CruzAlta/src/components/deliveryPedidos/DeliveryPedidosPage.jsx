import React, { useEffect, useState } from "react";
import { Accordion, Button, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const DeliveryPedidosPage = () => {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const fetchPedidos = async () => {
    try {
      const res = await fetch(`https://localhost:7042/api/PedidoDelivery/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error HTTP:", res.status, errorText);
        setMensaje({ texto: "No se pudieron cargar los pedidos", tipo: "danger" });
        return;
      }

      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      setMensaje({ texto: "Error de red o del servidor", tipo: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const marcarEntregado = async (idPedido) => {
  try {
    setLoading(true); // opcional: mostrar spinner
    const response = await fetch(`https://localhost:7042/api/PedidoDelivery/entregar/${idPedido}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      const texto = await response.text();
      console.error("Error al marcar como entregado:", texto);
      setMensaje({ texto: "No se pudo marcar como entregado", tipo: "danger" });
      return;
    }

    await fetchPedidos(); // <- importante
    setMensaje({ texto: "Pedido marcado como entregado", tipo: "success" });
    setTimeout(() => setMensaje(null), 3000);
  } catch (error) {
    console.error("Error marcando como entregado:", error);
    setMensaje({ texto: "Error de red", tipo: "danger" });
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const intervalo = setInterval(() => {
    if (user && user.id && user.token) {
      fetchPedidos();
    }
  }, 15000); // cada 15 segundos

  return () => clearInterval(intervalo); // limpiar al desmontar
}, [user]);



  useEffect(() => {
    if (user && user.id && user.token) {
      fetchPedidos();
    }
  }, [user]);

  if (!user) return <p>Cargando usuario...</p>;
  if (loading) return <Spinner animation="border" />;

  return (
    <div className="container mt-4">
      <h2>Mis Pedidos</h2>
      {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}

      {pedidos.length === 0 ? (
        <Alert variant="info">No tenés pedidos asignados.</Alert>
      ) : (
        <Accordion>
          {pedidos.map((pedido, index) => (
            <Accordion.Item key={pedido.idPedido} eventKey={index.toString()}>
              <Accordion.Header>
                {pedido.clienteNombre} - Total: ${pedido.total.toFixed(2)}
              </Accordion.Header>
              <Accordion.Body>
                <p><strong>Dirección:</strong> {pedido.direccion}</p>
                <p><strong>Teléfono:</strong> {pedido.telefono}</p>

                {pedido.estado === 3 ? (
                  <Alert variant="success">Pedido ya entregado</Alert>
                ) : (
                  <Button variant="success" onClick={() => marcarEntregado(pedido.idPedido)}>
                    Marcar como entregado
                  </Button>
                )}

              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default DeliveryPedidosPage;
