import React, { useEffect, useState } from "react";
import { Container, Form, Table, Alert, Spinner } from "react-bootstrap";

const CuentaCorrienteAdmin = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [movimientos, setMovimientos] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = "https://localhost:7042/api";

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await fetch(`${baseUrl}/Client/GetAll`, { headers });
        const data = await res.json();
        setClientes(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClientes();
  }, []);

  const handleChangeCliente = async (e) => {
    const idCliente = e.target.value;
    setClienteSeleccionado(idCliente);
    if (!idCliente) return;

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("jwtToken");
      const headers = { Authorization: `Bearer ${token}` };

      const resMov = await fetch(`${baseUrl}/CuentaCorriente/movimientos/${idCliente}`, { headers });
      const resSaldo = await fetch(`${baseUrl}/CuentaCorriente/saldo/${idCliente}`, { headers });

      if (!resMov.ok || !resSaldo.ok) throw new Error("Error al obtener movimientos");

      const movimientosData = await resMov.json();
      const saldoData = await resSaldo.json();

      setMovimientos(movimientosData); // lista directa
      setSaldo(saldoData.saldo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h3>Cuenta Corriente de Clientes</h3>

      <Form.Group controlId="clienteSelect" className="my-3">
        <Form.Label>Seleccionar cliente</Form.Label>
        <Form.Select value={clienteSeleccionado} onChange={handleChangeCliente}>
          <option value="">-- Seleccione --</option>
          {clientes.map((c) => (
            <option key={c.idCliente} value={c.idCliente}>
              {c.nombre} {c.apellido}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {saldo !== null && (
        <Alert variant={saldo >= 0 ? "success" : "danger"}>
          {saldo >= 0
            ? `Saldo a favor del cliente: $${saldo.toFixed(2)}`
            : `El cliente debe: $${Math.abs(saldo).toFixed(2)}`}
        </Alert>
      )}

      <Table bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Fecha</th>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">Sin movimientos</td>
            </tr>
          ) : (
            movimientos.map((mov, idx) => (
              <tr key={idx}>
                <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                <td>{mov.descripcion}</td>
                <td>${mov.monto.toFixed(2)}</td>
                <td>{mov.esHaber ? "Haber" : "Debe"}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default CuentaCorrienteAdmin;
