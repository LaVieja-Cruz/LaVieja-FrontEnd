import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Button
} from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";

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

  const exportarPDF = () => {
    window.open(
      `https://localhost:7042/api/Caja/exportar-resumen-dia?fecha=${fecha}`,
      "_blank"
    );
  };

  return (
    <Container className="mt-4">
      <h3>Detalle de Caja</h3>
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
          <Table bordered>
            <thead className="table-dark">
              <tr>
                <th>Fecha/Hora</th>
                <th>Concepto</th>
                <th>Debe</th>
                <th>Haber</th>
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
                    <td>{!mov.esIngreso ? `$${mov.monto.toFixed(2)}` : "-"}</td>
                    <td>{mov.esIngreso ? `$${mov.monto.toFixed(2)}` : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={2}>Totales</th>
                <th>${egresos.toFixed(2)}</th>
                <th>${ingresos.toFixed(2)}</th>
              </tr>
              <tr>
                <th colSpan={2}>Saldo final</th>
                <th colSpan={2} className={(ingresos - egresos) >= 0 ? "text-success" : "text-danger"}>
                  ${ (ingresos - egresos).toFixed(2) }
                </th>
              </tr>
            </tfoot>
          </Table>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={() => navigate("/admin/caja")}>
              Volver a Caja
            </Button>
            <Button variant="primary" onClick={exportarPDF}>
              Exportar PDF
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default DetalleCaja;
