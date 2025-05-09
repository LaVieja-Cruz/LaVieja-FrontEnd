const AboutSection = () => {
  return (
    <section className="py-5 bg-white">
      <Container>
        <div className="text-center mb-5 mx-auto" style={{ maxWidth: '800px' }}>
          <h2 className="fw-bold mb-4">LA KESA, UN PARAISO A LA RIVERA DEL RIO GUARDAMAR</h2>
          <p className="text-muted">
            Un punto ideal de no solo una piscina natural con barbacoas y actividades acuáticas, 
            sino un paraíso natural rodeado de pinos centenarios y formaciones rocosas.
          </p>
        </div>
        
        <Row className="mt-5 g-4">
          {/* Tarjetas de actividades */}
          <Col md={4}>
            <ActivityCard 
              image="/activity-1.jpg" 
              title="ACTIVIDADES ACUÁTICAS" 
              description="Disfruta de nuestro río y piscina natural"
            />
          </Col>
          <Col md={4}>
            <ActivityCard 
              image="/activity-2.jpg" 
              title="EVENTOS Y CELEBRACIONES" 
              description="El lugar perfecto para tus eventos especiales"
            />
          </Col>
          <Col md={4}>
            <ActivityCard 
              image="/activity-3.jpg" 
              title="PISCINA NATURAL" 
              description="Refréscate en nuestras instalaciones"
            />
          </Col>
        </Row>
        
        <div className="text-center mt-5">
          <Button variant="warning" className="rounded-pill px-4">
            SABER MÁS
          </Button>
        </div>
      </Container>
    </section>
  );
};
export default AboutSection;