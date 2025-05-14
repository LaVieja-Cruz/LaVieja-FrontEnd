import { Card } from 'react-bootstrap';
import './PresentationPage.css';
const PresentationPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card 
        style={{ width: '600px', height: '600px' }} 
        className="border-0 d-flex justify-content-center align-items-center">
        <h2 className="colortxt py-6 m-5">Bienvenidos al sistema. Inicie sesión para continuar.</h2>
        <img src="/images/logo.svg" alt="logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Card>
    </div>
  );
};

export default PresentationPage;
