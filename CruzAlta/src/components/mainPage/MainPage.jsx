import React from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  Button,
  Card,
} from "react-bootstrap";

import LoginPage from "../loginPage/LoginPage";
const MainPage = () => {
  return(
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card 
        style={{ width: '600px', height: '600px' }} 
        className="border-0 d-flex justify-content-center align-items-center">
   
        <img src="/images/logo.svg" alt="logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Card>
    </div>
  );
};

export default MainPage;
