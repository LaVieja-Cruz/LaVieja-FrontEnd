import React, { useRef, useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const EmailVerification = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (secondsLeft === 0 && timer) {
      clearInterval(timer);
      setTimer(null);
      setIsButtonDisabled(false);
    }
  }, [secondsLeft, timer]);

  const startTimer = () => {
    setIsButtonDisabled(true);
    setSecondsLeft(30);
    const newTimer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    setTimer(newTimer);
  };

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    e.target.value = value;
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = inputRefs.current.map((input) => input.value).join("");
    console.log("Código ingresado:", code);

    // Inicia el timer de 30 segundos
    startTimer();
  };

  const handleBack = () => navigate("/forgot-password");

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Card>
        <div style={{ maxWidth: "400px", width: "100%" }} className="p-4">
          <div className="d-flex align-items-center text-center mb-3">
            <Button
              variant="link"
              onClick={handleBack}
              className="p-0 me-2 text-dark"
            >
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </Button>
            <h5 className="fw-bold mb-0 ">Verificación</h5>
          </div>

          <h2 className="fw-bold mb-2 text-start">Verificación Email</h2>
          <p className="text-muted text-start">
            Introduzca el código de verificación que le enviamos: <br />
            <strong>Alberts******@gmail.com</strong>
          </p>

          <Form onSubmit={handleSubmit}>
            <Row className="justify-content-center mb-3">
              {[...Array(6)].map((_, i) => (
                <Col key={i} xs={2} className="px-1">
                  <Form.Control
                    type="text"
                    maxLength={1}
                    ref={(el) => (inputRefs.current[i] = el)}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="text-center fs-4 rounded border border-2"
                  />
                </Col>
              ))}
            </Row>

            <div className="text-center text-muted mb-2">
              ¿No ha recibido el código?{" "}
              <span className="colortxt" role="button">
                Vuelva a enviar
              </span>
            </div>

            {secondsLeft > 0 && (
              <div className="text-center text-muted mb-4">
                <i className="bi bi-clock me-1"></i>
                {formatTime(secondsLeft)}
              </div>
            )}

            <Button
              type="submit"
              className={`w-100 colorbutton rounded-pill py-2 ${
                isButtonDisabled ? "disabled-custom" : ""
              }`}
              disabled={false}
              onClick={!isButtonDisabled ? handleSubmit : undefined}
            >
              {isButtonDisabled ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Espere...
                </>
              ) : (
                "Continuar"
              )}
            </Button>
          </Form>
        </div>
      </Card>
    </Container>
  );
};

export default EmailVerification;
