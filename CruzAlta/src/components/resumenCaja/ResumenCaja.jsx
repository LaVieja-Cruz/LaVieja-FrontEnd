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
import { useNavigate } from "react-router-dom";

const ResumenCaja = () => {
  const [cajas, setCajas] = useState([]);
  const [filtro, setFiltro] = useState("dia");
  const [fecha, setFecha] = useState(new Date());
  const [desde, setDesde] = useState(new Date());
  const [hasta, setHasta] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
  }, [filtro, fecha, desde, hasta]);

  const exportarPDF = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      let url = "";

      if (filtro === "dia") {
        const fechaStr = fecha.toISOString().split("T")[0];
        url = `${apiUrl}/exportar-resumen-dia?fecha=${fechaStr}`;
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

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error("Error al exportar PDF");
      }

      const blob = await response.blob();
      const pdfUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = pdfUrl;

      let nombreArchivo = "ResumenCaja.pdf";
      if (filtro === "dia") nombreArchivo = `ResumenCaja_${fecha.toISOString().split("T")[0]}.pdf`;
      else if (filtro === "mes") nombreArchivo = `ResumenCaja_${fecha.toISOString().slice(0, 7)}.pdf`;
      else if (filtro === "anio") nombreArchivo = `ResumenCaja_${fecha.getFullYear()}.pdf`;

      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Hubo un error al exportar el PDF.");
    }
  };

  const verDetalles = (fecha) => {
    const fechaStr = new Date(fecha).toISOString().split("T")[0];
    navigate(`/admin/caja/detalle?fecha=${fechaStr}`);
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
        <>
          {cajas.length > 1 && (
            <Alert variant="info">
              <strong>Totales Generales:</strong><br />
              Ingresos: ${cajas.reduce((acc, c) => acc + c.totalIngresos, 0).toFixed(2)} |{" "}
              Egresos: ${cajas.reduce((acc, c) => acc + c.totalEgresos, 0).toFixed(2)} |{" "}
              Neto: ${cajas.reduce((acc, c) => acc + (c.totalIngresos - c.totalEgresos), 0).toFixed(2)}
            </Alert>
          )}

          <Table bordered hover>
            <thead className="table-dark">
              <tr>
                {cajas.length > 1 && <th>IdCaja</th>}
                <th>Fecha</th>
                <th>Ingresos (Bruto)</th>
                <th>Egresos</th>
                <th>Neto</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {cajas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted fst-italic">
                    No hay datos para mostrar para la fecha seleccionada.
                  </td>
                </tr>
              ) : (
                cajas.map((caja, index) => (
                  <tr key={index}>
                    {cajas.length > 1 && <td>{caja.idCaja ?? "-"}</td>}
                    <td>{caja.fecha ? new Date(caja.fecha).toLocaleDateString() : "-"}</td>
                    <td>${caja.totalIngresos?.toFixed(2) ?? "0.00"}</td>
                    <td>${caja.totalEgresos?.toFixed(2) ?? "0.00"}</td>
                    <td>${((caja.totalIngresos ?? 0) - (caja.totalEgresos ?? 0)).toFixed(2)}</td>
                    <td>
                      <Button variant="info" onClick={() => verDetalles(caja.fecha)}>
                        Ver Detalles
                      </Button>
                    </td>
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

export default ResumenCaja;
