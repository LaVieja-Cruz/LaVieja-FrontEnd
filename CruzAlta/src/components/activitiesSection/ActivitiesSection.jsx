const ActivitiesSection = () => {
  return (
    <section className="py-5 bg-light">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <img 
              src="/nature-image.jpg" 
              alt="Entorno natural" 
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6}>
            <h2 className="fw-bold mb-4">LA KESA, EL DESTINO MEJOR GUARDADO DE GUARDAMAR</h2>
            <p className="text-muted mb-4">
              Descubre nuestro oasis natural con instalaciones de calidad para disfrutar 
              de la naturaleza sin renunciar al confort.
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

export default ActivitiesSection;