import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

let decodedJwt = null;
const token = localStorage.getItem("jwtToken");
if (token) {
  try {
    decodedJwt = jwtDecode(token);
  } catch (error) {
    console.error("Token inválido:", error);
  }
}

const LayoutNav = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => navigate('/login');
  const handleLogoutClick = () => logout();

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand href="/">
          <img src="/logo-la-kesa.png" alt="LA VIEJA" height="40" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto align-items-center">
            <Nav.Link href="#home" className="colortxt fw-bold">TEMPORADA</Nav.Link>
            <Nav.Link href="#lakesa" className="colortxt fw-bold">DÍA</Nav.Link>
            <Nav.Link href="#camping" className="colortxt fw-bold">DECK</Nav.Link>
            <Nav.Link href="#descubre" className="colortxt fw-bold">CAMPING</Nav.Link>
            <Nav.Link href="#descubre" className="colortxt fw-bold">RECORRIDO</Nav.Link>
            {isLoggedIn && decodedJwt?.role === "3" && (
            <Nav.Link href="/delivery/pedidos">Mis Pedidos</Nav.Link>
            )}

            {isLoggedIn && (
            <Nav.Link href="/admin/mapa" className="colortxt fw-bold">Mapa Deliverys</Nav.Link>
            )}

            {!isLoggedIn ? (
              <Button  className="ms-3 txtcolor colorbutton" onClick={handleLoginClick}>
                Iniciar sesión
              </Button>
            ) : (
              <Button  className="ms-3 txtcolor colorbutton" onClick={handleLogoutClick}>
                Cerrar sesión
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LayoutNav;
