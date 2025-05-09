const AccommodationSection = () => {
  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <img 
              src="/accommodation.jpg" 
              alt="Alojamiento" 
              className="img-fluid rounded shadow" 
            />
          </Col>
          <Col md={6}>
            <h2 className="fw-bold mb-4">ALOJAMIENTO</h2>
            <p className="text-muted mb-4">
              Disfruta de nuestras opciones de alojamiento en plena naturaleza. 
              Cabañas confortables y zona de camping para que elijas la opción 
              que mejor se adapte a ti.
            </p>
            <Button variant="warning" className="rounded-pill px-4">
              SABER MÁS
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AccommodationSection;