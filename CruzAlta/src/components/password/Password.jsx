import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el código de confirmación
    console.log('Correo enviado a:', email);
  };

  
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Card>
        <div style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="fw-bold mb-3">¿Ha olvidado su contraseña?</h2>
        <p className="text-muted">
          Introduzca su dirección de correo electrónico y le enviaremos un código de confirmación para restablecer su contraseña.
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="mb-4">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button
            type="submit"
            className="w-100 rounded-pill py-2 colorbutton"
          >
            Continue
          </Button>
        </Form>
      </div>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
