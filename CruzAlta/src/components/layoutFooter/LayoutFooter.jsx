import { Container, Row, Col } from 'react-bootstrap';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram, FaChevronRight, FaClock } from 'react-icons/fa';
import Map from '../map/map';
import './LayoutFooter.css'
const Footer = () => {
  return (
    <footer className="footer text-white py-5 w-100">
      <Container fluid>
        <Row>

          {/* Enlaces */}
          <Col md={3} className='text-start p-4'>
            <h4 className="colortxt fw-bold">HORARIOS</h4>
            <h6 className='colortxt fw-bold'>FINES DE SEMANA Y FERIADOS</h6>
            <h6 className='colortxt'>NATATORIO: 10:00 A 20:00 HS</h6>
            <h6 className='colortxt '>PREDIO: 10:00 A 02:00 HS</h6>
            <h6 className='colortxt fw-bold'>DÍA DE SEMANA</h6>
            <h6 className='colortxt'>NATATORIO: 10:00 A 20:00 HS</h6>
            <h6 className='colortxt '>PREDIO: 10:00 A 01:00 HS</h6>
          </Col>

          {/* Logo e info */}
          <Col md={2} className='text-start p-4'>
          <h4 className="colortxt ">TEMPORADAS</h4>
          <h4 className="colortxt ">DÍA</h4>
          <h4 className="colortxt ">DECK</h4>
          <h4 className="colortxt ">CAMPING</h4>
          <h4 className="colortxt ">RECORRIDO</h4>
          </Col>

        
          {/* Horarios y redes */}
         
          <Col md={4} className='text-start p-4'>
          <h5 className="colortxt ">REGLAS DE CONVIVENCIA</h5>
          <h5 className="colortxt ">POLITICAS DE PRIVACIDAD</h5>
          <h5 className="colortxt ">TERMINOS Y CONDICIONES</h5>
          </Col>

          <Col md={3}>
            {/* Íconos de redes sociales */}
  <div className="mb-3">
    <a
      href="https://www.facebook.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="colortxt fs-4 me-3 icon-hover"
    >
      <FaFacebookF />
    </a>
    <a
      href="https://www.instagram.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="colortxt fs-4 me-3 icon-hover"
    >
      <FaInstagram />
    </a>
    <a
      href="https://wa.me/5490000000000"
      target="_blank"
      rel="noopener noreferrer"
      className="colortxt fs-4 icon-hover"
    >
      <FaWhatsapp />
    </a>
  </div>

  {/* Mapa */}
  <Map />
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        <Row className="align-items-center">
            <p className="colortxt fw--bold mb-0"> © 2025. DISEÑO Y DESARROLLO IDEMCODE</p>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;