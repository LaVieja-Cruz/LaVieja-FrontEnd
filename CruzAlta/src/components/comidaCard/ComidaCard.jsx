// ComidaCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ComidaCard = ({ comida, onAgregarAlPedido }) => {
  // Maneja el click de 'Añadir al pedido', pasando id y nombre desde la propiedad 'comida'
  const handleAgregar = () => {
    onAgregarAlPedido({
      id: comida.idComida,
      nombre: comida.comida
    });
  };

  return (
    <Card style={{ width: '250px', height: '250px', margin: '0.5rem', overflow: 'hidden' }}>
      {/* Si hay imagen, mostrarla */}
      {comida.imagen && (
        <Card.Img
          variant="top"
          src={comida.imagen}
          style={{ height: '100px', objectFit: 'cover' }}
        />
      )}

      <Card.Body className="d-flex flex-column p-2">
        {/* Mostrar el nombre desde el campo 'comida' */}
        <Card.Title style={{ fontSize: '1rem' }}>{comida.comida}</Card.Title>

        {/* Botón para agregar al pedido */}
        <Button
          variant="primary"
          size="sm"
          className="mt-auto"
          onClick={handleAgregar}
        >
          Añadir al pedido
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ComidaCard;
