// Componente Header (Navbar)
const Header = () => {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand href="#home">
          <img src="/logo-la-kesa.png" alt="La Kesa" height="40" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto">
            <Nav.Link href="#home" className="text-dark">INICIO</Nav.Link>
            <Nav.Link href="#lakesa" className="text-dark">LA VIEJA</Nav.Link>
            <Nav.Link href="#camping" className="text-dark">CAMPING</Nav.Link>
            <Nav.Link href="#descubre" className="text-dark">DESCUBRE</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};