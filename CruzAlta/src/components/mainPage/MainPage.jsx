import React from 'react';
import { Container, Row, Col, Nav, Navbar, Button, Card } from 'react-bootstrap';

const MainPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <HeroBanner />
        <AboutSection />
        <ActivitiesSection />
        <ExperienceSection />
        <AccommodationSection />
      </main>
      <Footer />
    </div>
  );
};

export default MainPage;