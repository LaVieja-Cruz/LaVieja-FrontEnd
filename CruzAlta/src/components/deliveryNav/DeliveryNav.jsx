// components/layoutNav/DeliveryNav.jsx
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './deliveryNav.css'

const DeliveryNav = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
    const handleLogoutClick = () => {
        navigate('/');
        logout();
    }
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand href="/">
          <img src="/images/logo.svg" alt="LA VIEJA" height="40" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto align-items-center">
            <Nav.Link href="/delivery/pedidos">Mis Pedidos</Nav.Link>
            <Button className="ms-3 txtcolor colorbutton" onClick={handleLogoutClick}>
              Cerrar sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DeliveryNav;
