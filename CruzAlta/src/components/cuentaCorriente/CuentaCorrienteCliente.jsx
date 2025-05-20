import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert, Table } from "react-bootstrap";

const CuentaCorrienteCliente = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiMovimientos = "https://localhost:7042/api/CuentaCorriente/movimientos";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch(apiMovimientos, { headers });
        if (!response.ok) throw new Error("Error al cargar los datos de cuenta corriente");

        const data = await response.json();
        setMovimientos(data.movimientos);
        setSaldo(data.saldo);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="mt-4">
      <h3>Mi Cuenta Corriente</h3>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <Alert variant={saldo >= 0 ? "success" : "danger"}>
            {saldo >= 0
              ? `Tienes saldo a favor de $${saldo.toFixed(2)}`
              : `Tienes una deuda de $${Math.abs(saldo).toFixed(2)}`}
          </Alert>

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
                movimientos.map((mov, i) => (
                  <tr key={i}>
                    <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                    <td>{mov.concepto}</td>
                    <td>${mov.monto.toFixed(2)}</td>
                    <td>{mov.tipo === "Haber" ? "Haber (a tu favor)" : "Debe (tu deuda)"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default CuentaCorrienteCliente;
