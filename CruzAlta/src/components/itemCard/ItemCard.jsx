import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ItemCard = ({ item, onAgregarAlPedido }) => (
  <Card className="h-100">
    {item.imagenUrl && (
      <Card.Img
        variant="top"
        src={item.imagenUrl}
        alt={item.nombre}
        style={{ height: 100, objectFit: 'cover', width: '100%' }}
      />
    )}
    <Card.Body className="d-flex flex-column p-2">
      <Card.Title style={{ fontSize: '0.9rem', textAlign: 'center' }}>
        {item.nombre}
      </Card.Title>
      <div className="mb-1 text-center">
        <strong>
          {typeof item.precio === 'number'
            ? `$${item.precio.toFixed(2)}`
            : 'Precio no disponible'}
        </strong>
      </div>
      {typeof item.stock === 'number' && (
        <div className="mb-2 text-center">
          <small className={`text-${item.stock > 0 ? 'muted' : 'danger'}`}>
            Stock: {item.stock}
          </small>
        </div>
      )}
      <Button
        size="sm"
        className="mt-auto colorbutton"
        onClick={onAgregarAlPedido}
        disabled={item.stock <= 0}
      >
        {item.stock > 0 ? 'Añadir al pedido' : 'Sin stock'}
      </Button>
    </Card.Body>
  </Card>
);

export default ItemCard;
