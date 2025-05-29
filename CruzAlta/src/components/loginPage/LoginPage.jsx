import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';
import { useAuth } from '../../context/AuthContext';
import { authenticateUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';// 🔁 Asegurate de tener esto instalado: npm install jwt-decode

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await authenticateUser(email, password);
      login(token);
      setMessage('Inicio de sesión exitoso');

      // 🔑 Extraer el rol del token
      const decoded = jwtDecode(token);
      const rol = parseInt(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);

      // 🚀 Redirigir según el rol
      if (rol === 1) {
        navigate('/admin/Admincocina');
      } else {
        navigate('/main', { state: { loginSuccess: true } });
      }
    } catch (error) {
      setMessage('Usuario o contraseña incorrectos');
    }
  };

  const handleForgetPasswordClick = () => navigate('/forgot-password');

  return (
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100">
      <div className="login-box w-100" style={{ maxWidth: '400px' }}>
        <h2 className="fw-bold mb-1">Acceda a su cuenta.</h2>
        <p className="text-muted mb-4">Por favor acceda a su cuenta</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="tuemail@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2 position-relative">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-end mt-1">
              <a href="" className="colortxt text-decoration-none small" onClick={handleForgetPasswordClick}>
                ¿Olvidaste la contraseña?
              </a>
            </div>
          </Form.Group>

          <Button type="submit" className="btn colorbutton w-100 rounded-pill mt-3">
            Iniciar sesión
          </Button>
        </Form>

        {message && (
          <div className={`mt-3 ${message.includes('exitoso') ? 'text-success' : 'text-danger'}`}>
            {message}
          </div>
        )}

        <div className="colortxt text-center">
          <small>
            ¿No tienes cuenta?{' '}
            <a className="colortxt" href="#" onClick={() => navigate('/register')}>
              Registrarse
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
