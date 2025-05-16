import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ItemCard = ({ item, onAgregarAlPedido }) => (
  <Card style={{ width: 250, height: 250, margin: '0.5rem' }}>
    {item.imagenUrl && (
      <Card.Img
        variant="top"
        src={item.imagenUrl}
        alt={item.nombre}
        style={{ height: 100, objectFit: 'cover' }}
      />
    )}
    <Card.Body className="d-flex flex-column p-2">
      <Card.Title style={{ fontSize: '1rem' }}>{item.nombre}</Card.Title>
      <div className="mb-2">
        <strong>
          {typeof item.precio === 'number'
            ? `$${item.precio.toFixed(2)}`
            : 'Precio no disponible'}
        </strong>
      </div>
      <Button
        size="sm"
        className="mt-auto colorbutton"
        onClick={onAgregarAlPedido}
      >
        Añadir al pedido
      </Button>
    </Card.Body>
  </Card>
);

export default ItemCard;
