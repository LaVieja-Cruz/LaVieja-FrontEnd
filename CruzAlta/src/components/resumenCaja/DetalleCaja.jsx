import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Table, Container, Spinner, Alert, Button } from "react-bootstrap";

const DetalleCaja = () => {
  const [searchParams] = useSearchParams();
  const fecha = searchParams.get("fecha");
  const navigate = useNavigate();

  const [movimientos, setMovimientos] = useState([]);
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cajaInexistente, setCajaInexistente] = useState(false);

  const apiUrl = "https://localhost:7042/api/Caja/dia/por-fecha";

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        setLoading(true);
        setError(null);
        setCajaInexistente(false);

        const token = localStorage.getItem("jwtToken");
        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const response = await fetch(`${apiUrl}?fecha=${fecha}`, { headers });
        if (!response.ok) {
          if (response.status === 404) {
            setCajaInexistente(true);
            return;
          }
          throw new Error("No se pudo cargar la caja");
        }

        const data = await response.json();

        if (!data || !data.movimientos) {
          setCajaInexistente(true);
          return;
        }

        setMovimientos(data.movimientos || []);
        setIngresos(data.totalIngresos || 0);
        setEgresos(data.totalEgresos || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fecha) fetchMovimientos();
  }, [fecha]);

  return (
    <Container className="mt-4">
      <h2>Detalle de Caja</h2>
      <p className="text-muted">Fecha: {new Date(fecha).toLocaleDateString()}</p>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && cajaInexistente && (
        <Alert variant="warning">
          No hay caja registrada para esta fecha.
        </Alert>
      )}

      {!loading && !error && !cajaInexistente && (
        <>
          <Alert variant="info">
            <strong>Totales:</strong> Ingresos: ${ingresos.toFixed(2)} | Egresos: ${egresos.toFixed(2)} | Neto: {(ingresos - egresos).toFixed(2)}
          </Alert>

          <Table bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Fecha/Hora</th>
                <th>Concepto</th>
                <th>Tipo</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted fst-italic">
                    No hay movimientos para esta fecha.
                  </td>
                </tr>
              ) : (
                movimientos.map((mov, idx) => (
                  <tr key={idx}>
                    <td>{new Date(mov.fecha).toLocaleString()}</td>
                    <td>{mov.concepto}</td>
                    <td>{mov.esIngreso ? "Ingreso" : "Egreso"}</td>
                    <td>${mov.monto.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </>
      )}

      <Button variant="secondary" onClick={() => navigate("/admin/caja")}>Volver a Caja</Button>
    </Container>
  );
};

export default DetalleCaja;