const ExperienceSection = () => {
  return (
    <section className="py-5 bg-white">
      <Container>
        <Row className="align-items-center flex-column-reverse flex-md-row">
          <Col md={6}>
            <h2 className="fw-bold mb-4">UNA EXPERIENCIA DE DESCONEXIÓN INIGUALABLE</h2>
            <p className="text-muted mb-4">
              Sumérgete en la tranquilidad de nuestro entorno natural y desconecta 
              del estrés diario con nuestras actividades al aire libre.
            </p>
            <Button variant="warning" className="rounded-pill px-4">
              DESCUBRIR MÁS
            </Button>
          </Col>
          <Col md={6} className="mb-4 mb-md-0">
            <img 
              src="/woman-walking.jpg" 
              alt="Experiencia única" 
              className="img-fluid rounded shadow" 
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ExperienceSection;