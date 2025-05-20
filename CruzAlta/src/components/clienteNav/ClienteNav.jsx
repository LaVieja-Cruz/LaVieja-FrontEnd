// src/components/clienteNav/ClienteNav.jsx
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ClienteNav = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    navigate('/');
    logout();
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand href="/main">
          <img src="/images/logo.svg" alt="LA VIEJA" height="40" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto align-items-center">
            <Nav.Link className="colortxt" href="/cuenta-corriente">Mi Cuenta Corriente</Nav.Link>
            <Nav.Link className="colortxt" href="/menu">Menú</Nav.Link>
            {/* Agrega más enlaces si deseas */}
            <Button className="ms-3 txtcolor colorbutton" onClick={handleLogoutClick}>
              Cerrar sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ClienteNav;
