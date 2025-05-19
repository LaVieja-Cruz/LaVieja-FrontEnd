import React, { useEffect, useState } from "react";
import {
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ResumenCaja = () => {
  const [cajas, setCajas] = useState([]);
  const [filtro, setFiltro] = useState("dia");
  const [fecha, setFecha] = useState(new Date());
  const [desde, setDesde] = useState(new Date());
  const [hasta, setHasta] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = "https://localhost:7042/api/Caja";

  const fetchCaja = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwtToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      let response, data;

      if (filtro === "dia") {
        const fechaStr = fecha.toISOString().split("T")[0];
        response = await fetch(`${apiUrl}/dia/por-fecha?fecha=${fechaStr}`, {
          headers,
        });
        if (!response.ok) throw new Error("Error al cargar resumen diario");
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
        setCajas(data ? [data] : []);
      } else if (filtro === "semana") {
        const fechaHasta = new Date(fecha);
        const fechaDesde = new Date(fecha);
        fechaDesde.setDate(fechaDesde.getDate() - 6);
        const desdeStr = fechaDesde.toISOString();
        const hastaStr = fechaHasta.toISOString();
        response = await fetch(`${apiUrl}/rango?desde=${desdeStr}&hasta=${hastaStr}`, {
          headers,
        });
        if (!response.ok) throw new Error("Error al cargar resumen semanal");
        const text = await response.text();
        data = text ? JSON.parse(text) : [];
        setCajas(data);
      } else if (filtro === "mes") {
        const mes = fecha.toISOString().slice(0, 7);
        response = await fetch(`${apiUrl}/ResumenMensual?mes=${mes}`, {
          headers,
        });
        if (!response.ok) throw new Error("Error al cargar resumen mensual");
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
        setCajas(data ? [data] : []);
      } else if (filtro === "anio") {
        const anio = fecha.getFullYear();
        response = await fetch(`${apiUrl}/ResumenAnual?anio=${anio}`, {
          headers,
        });
        if (!response.ok) throw new Error("Error al cargar resumen anual");
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
        setCajas(data ? [data] : []);
      } else if (filtro === "rango") {
        const desdeStr = desde.toISOString();
        const hastaStr = hasta.toISOString();
        response = await fetch(`${apiUrl}/rango?desde=${desdeStr}&hasta=${hastaStr}`, {
          headers,
        });
        if (!response.ok) throw new Error("Error al cargar resumen por rango");
        const text = await response.text();
        data = text ? JSON.parse(text) : [];
        setCajas(data);
      }
    } catch (err) {
      console.error("Error al obtener datos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaja();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro, fecha, desde, hasta]);

  const exportarPDF = () => {
    let url = "";
    if (filtro === "dia") {
      const fechaStr = fecha.toISOString().split("T")[0];
      url = `${apiUrl}/exportar-pdf?fecha=${fechaStr}`;
    } else if (filtro === "semana") {
      const fechaHasta = new Date(fecha);
      const fechaDesde = new Date(fecha);
      fechaDesde.setDate(fechaDesde.getDate() - 6);
      const desdeStr = fechaDesde.toISOString();
      const hastaStr = fechaHasta.toISOString();
      url = `${apiUrl}/exportar-pdf-semana?desde=${desdeStr}&hasta=${hastaStr}`;
    } else if (filtro === "mes") {
      const mes = fecha.toISOString().slice(0, 7);
      url = `${apiUrl}/exportar-pdf-mes?mes=${mes}`;
    } else if (filtro === "anio") {
      const anio = fecha.getFullYear();
      url = `${apiUrl}/exportar-pdf-anio?anio=${anio}`;
    } else if (filtro === "rango") {
      const desdeStr = desde.toISOString();
      const hastaStr = hasta.toISOString();
      url = `${apiUrl}/exportar-pdf-semana?desde=${desdeStr}&hasta=${hastaStr}`;
    }

    window.open(url, "_blank");
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Resumen de Caja</h2>

      <Row className="mb-3 align-items-end">
        <Col xs="auto">
          <Form.Label>Filtro</Form.Label>
          <Form.Select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
            <option value="anio">Año</option>
            <option value="rango">Rango</option>
          </Form.Select>
        </Col>

        {(filtro === "dia" || filtro === "semana") && (
          <Col xs="auto">
            <Form.Label>Fecha</Form.Label>
            <DatePicker
              selected={fecha}
              onChange={(date) => setFecha(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              todayButton="Hoy"
            />
          </Col>
        )}

        {filtro === "mes" && (
          <Col xs="auto">
            <Form.Label>Mes</Form.Label>
            <DatePicker
              selected={fecha}
              onChange={(date) => setFecha(date)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="form-control"
              todayButton="Hoy"
            />
          </Col>
        )}

        {filtro === "anio" && (
          <Col xs="auto">
            <Form.Label>Año</Form.Label>
            <DatePicker
              selected={fecha}
              onChange={(date) => setFecha(date)}
              dateFormat="yyyy"
              showYearPicker
              className="form-control"
              todayButton="Hoy"
            />
          </Col>
        )}

        {filtro === "rango" && (
          <>
            <Col xs="auto">
              <Form.Label>Desde</Form.Label>
              <DatePicker
                selected={desde}
                onChange={(date) => setDesde(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
              />
            </Col>
            <Col xs="auto">
              <Form.Label>Hasta</Form.Label>
              <DatePicker
                selected={hasta}
                onChange={(date) => setHasta(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
              />
            </Col>
          </>
        )}
      </Row>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      )}

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      <div className="mb-3">
        <Button variant="danger" onClick={exportarPDF}>
          Exportar PDF
        </Button>
      </div>

      {!loading && !error && (
        <Table bordered hover>
          <thead className="table-dark">
            <tr>
              <th>IdCaja</th>
              <th>Fecha</th>
              <th>Total Ingresos</th>
              <th>Total Egresos</th>
            </tr>
          </thead>
          <tbody>
            {cajas.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted fst-italic">
                  No hay datos para mostrar para la fecha seleccionada.
                </td>
              </tr>
            ) : (
              cajas.map((caja, index) => (
                <tr key={index}>
                  <td>{caja.idCaja ?? "-"}</td>
                  <td>{caja.fecha ? new Date(caja.fecha).toLocaleDateString() : "-"}</td>
                  <td>${caja.totalIngresos?.toFixed(2) ?? "0.00"}</td>
                  <td>${caja.totalEgresos?.toFixed(2) ?? "0.00"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ResumenCaja;
