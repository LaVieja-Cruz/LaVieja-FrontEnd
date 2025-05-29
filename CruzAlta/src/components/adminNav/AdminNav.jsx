// components/layoutNav/AdminNav.jsx
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GiHabitatDome } from "react-icons/gi";
import './AdminNav.css'
const AdminNav = () => {
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
            <Nav.Link className= "colortxt " href="/admin/Admincocina">Cocinaadmin</Nav.Link>
            <Nav.Link className= "colortxt " href="/admin/cocina">Cocina</Nav.Link>
            <Nav.Link className="colortxt" href="/admin/stock">Stocks</Nav.Link>
            <Nav.Link className="colortxt" href="/admin/cuenta-corriente">CtaCTE Admin</Nav.Link>
            <Nav.Link className="colortxt" href="/admin/compras">Compras Proveedor</Nav.Link>
            <Nav.Link className= "colortxt " href="/admin/caja">Caja</Nav.Link>
            <Nav.Link className="colortxt" href="/proveedores">Proveedores</Nav.Link>
            <Nav.Link className= "colortxt " href="/admin/pedidos">Pedidos</Nav.Link>
            <Nav.Link className= "colortxt " href="/admin/mapa">Mapa Delivery</Nav.Link>
            <Button className="ms-3 txtcolor colorbutton" onClick={handleLogoutClick}>
              Cerrar sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNav;
