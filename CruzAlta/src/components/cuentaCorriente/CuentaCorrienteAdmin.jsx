import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Table,
  Alert,
  Spinner,
  Button,
  Modal,
  Row,
  Col,
  Toast, 
  ToastContainer
} from "react-bootstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CuantaCorriente.css';



const CuentaCorrienteAdmin = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [movimientos, setMovimientos] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tieneCuenta, setTieneCuenta] = useState(true);

  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [resumen, setResumen] = useState({ debe: 0, haber: 0 });

  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);

  const [montoPago, setMontoPago] = useState("");
  const [toast, setToast] = useState({
  show: false,
  message: "",
  variant: "success",
});

const mostrarToast = (message, variant = "success") => {
  setToast({ show: true, message, variant });
  setTimeout(() => {
    setToast({ ...toast, show: false });
  }, 3000);
};


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

      const resMov = await fetch(
        `${baseUrl}/CuentaCorriente/movimientos/${idCliente}`,
        { headers }
      );
      const resSaldo = await fetch(
        `${baseUrl}/CuentaCorriente/saldo/${idCliente}`,
        { headers }
      );

      if (!resMov.ok || !resSaldo.ok) {
        setTieneCuenta(false);
        setMovimientos([]);
        setSaldo(null);
        return;
      }

      const movimientosData = await resMov.json();
      const saldoData = await resSaldo.json();

      setMovimientos(movimientosData);
      setSaldo(saldoData.saldo);
      setTieneCuenta(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const crearCuentaCorriente = async () => {
    if (!clienteSeleccionado) return;
    try {
      const token = localStorage.getItem("jwtToken");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await fetch(
        `${baseUrl}/CuentaCorriente/crear/${clienteSeleccionado}`,
        {
          method: "POST",
          headers,
        }
      );

      if (!res.ok) throw new Error("No se pudo crear la cuenta");

      mostrarToast("Cuenta creada exitosamente.", "success");
      handleChangeCliente({ target: { value: clienteSeleccionado } });
    } catch (err) {
     mostrarToast("Error: " + err.message, "danger");
    }
  };

  const calcularResumen = () => {
    let debe = 0;
    let haber = 0;

    movimientos.forEach((m) => {
      if (m.esHaber) haber += m.monto;
      else debe += m.monto;
    });

    setResumen({ debe, haber });
    setMostrarResumen(true);
  };

  const exportarPDF = () => {
    if (!clienteSeleccionado) return;
    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
      mostrarToast("La fecha desde no puede ser mayor a la fecha hasta.", "danger");
      return;
    }

    const token = localStorage.getItem("jwtToken");

    const params = new URLSearchParams();
    if (fechaDesde) params.append("desde", fechaDesde.toISOString());
    if (fechaHasta) params.append("hasta", fechaHasta.toISOString());
    params.append("token", token);

    window.open(
      `${baseUrl}/CuentaCorriente/exportar-pdf/${clienteSeleccionado}?${params.toString()}`,
      "_blank"
    );
  };

  const pagarParcial = async () => {
    const monto = parseFloat(montoPago);
    if (isNaN(monto) || monto <= 0) {
      mostrarToast("Ingrese un monto válido.", "danger");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await fetch(
        `${baseUrl}/CuentaCorriente/pagar-parcial/${clienteSeleccionado}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ monto }),
        }
      );

      if (!res.ok) throw new Error("No se pudo registrar el pago.");

      mostrarToast("Pago registrado correctamente.", "success");
      setMontoPago("");
      handleChangeCliente({ target: { value: clienteSeleccionado } });
    } catch (err) {
      mostrarToast("Error: " + err.message, "danger");

    }
  };

  return (
    <Container className="mt-4">
      <h3>Cuenta Corriente de Clientes</h3>

      <Form.Group controlId="clienteSelect" className="my-3">
        <Form.Label>Seleccionar cliente</Form.Label>
        <Select
          value={
            clientes.find((c) => c.idCliente === clienteSeleccionado) || null
          }
          onChange={(opcion) =>
            handleChangeCliente({ target: { value: opcion.value } })
          }
          options={clientes.map((c) => ({
            value: c.idCliente,
            label: `${c.nombre} ${c.apellido}`,
          }))}
          placeholder="-- Seleccione --"
          isClearable
        />
      </Form.Group>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!tieneCuenta && clienteSeleccionado && (
        <Alert variant="warning">
          Este cliente aún no tiene cuenta corriente.{" "}
          <Button size="sm" onClick={crearCuentaCorriente}>
            Crear Cuenta Corriente
          </Button>
        </Alert>
      )}

      {tieneCuenta && saldo !== null && (
        <Alert variant={saldo >= 0 ? "success" : "danger"}>
          {saldo >= 0
            ? `Saldo a favor del cliente: $${saldo.toFixed(2)}`
            : `El cliente debe: $${Math.abs(saldo).toFixed(2)}`}
        </Alert>
      )}

      {tieneCuenta && movimientos.length > 0 && (
        <Button  className="mb-3 buttoncolor" onClick={calcularResumen}>
          Ver Resumen
        </Button>
      )}

      {tieneCuenta && (
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
                <td colSpan={4} className="text-center">
                  Sin movimientos
                </td>
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
      )}

      {/* Modal Resumen */}
      <Modal
        show={mostrarResumen}
        onHide={() => setMostrarResumen(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Resumen de Cuenta Corriente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <Form.Label>Desde</Form.Label>
              <DatePicker
                selected={fechaDesde}
                onChange={(date) => setFechaDesde(date)}
                className="form-control"
                placeholderText="Fecha desde"
                dateFormat="yyyy-MM-dd"
              />
            </Col>
            <Col>
              <Form.Label>Hasta</Form.Label>
              <DatePicker
                selected={fechaHasta}
                onChange={(date) => setFechaHasta(date)}
                className="form-control"
                placeholderText="Fecha hasta"
                dateFormat="yyyy-MM-dd"
              />
            </Col>
            <Col className="d-flex align-items-end">
              <Button variant="secondary" onClick={exportarPDF}>
                Exportar PDF
              </Button>
            </Col>
          </Row>

          <Table bordered>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Debe</th>
                <th>Haber</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov, idx) => (
                <tr key={idx}>
                  <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                  <td>{mov.descripcion}</td>
                  <td>{!mov.esHaber ? `$${mov.monto.toFixed(2)}` : "-"}</td>
                  <td>{mov.esHaber ? `$${mov.monto.toFixed(2)}` : "-"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="2">Totales</th>
                <th>${resumen.debe.toFixed(2)}</th>
                <th>${resumen.haber.toFixed(2)}</th>
              </tr>
              <tr>
                <th colSpan="2">Saldo final</th>
                <th colSpan="2" className={resumen.haber - resumen.debe >= 0 ? "text-success" : "text-danger"}>
                  ${ (resumen.haber - resumen.debe).toFixed(2) }
                </th>
              </tr>
            </tfoot>
          </Table>

          {saldo > 0 && (
            <Row className="mt-4">
              <Col md={4}>
                <Form.Control
                  type="number"
                  placeholder="Monto a pagar"
                  value={montoPago}
                  onChange={(e) => setMontoPago(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </Col>
              <Col md="auto">
                <Button className="buttoncolor" onClick={pagarParcial}>
                  Registrar Pago
                </Button>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarResumen(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    
  );
  <ToastContainer position="bottom-end" className="p-3">
  <Toast
    bg={toast.variant}
    onClose={() => setToast({ ...toast, show: false })}
    show={toast.show}
    delay={3000}
    autohide
  >
    <Toast.Body className="text-white">{toast.message}</Toast.Body>
  </Toast>
</ToastContainer>

};

export default CuentaCorrienteAdmin;
