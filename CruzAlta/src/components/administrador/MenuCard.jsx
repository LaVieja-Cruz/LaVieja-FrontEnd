import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const MenuCard = ({ menu, onAgregar }) => {
  const [cantidad, setCantidad] = useState(1);
  const [tamaño, setTamaño] = useState('');
  const [comidasSeleccionadas, setComidasSeleccionadas] = useState(menu.comidas);

  const agregar = () => {
    onAgregar(menu, cantidad, tamaño, comidasSeleccionadas);
    setCantidad(1);
    setTamaño('');
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{menu.nombre}</Card.Title>
        <Card.Text>Precio: ${menu.precio}</Card.Text>

        <Form.Group>
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={cantidad}
            onChange={e => setCantidad(parseInt(e.target.value))}
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Tamaño (opcional)</Form.Label>
          <Form.Select value={tamaño} onChange={e => setTamaño(e.target.value)}>
            <option value="">-- Seleccionar --</option>
            <option value="Media">Media</option>
            <option value="Familiar">Familiar</option>
            <option value="8 porciones">8 porciones</option>
            <option value="12 porciones">12 porciones</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Ingredientes / Gustos</Form.Label>
          <ul>
            {menu.comidas.map((comida, idx) => (
              <li key={idx}>{comida.nombre}</li>
            ))}
          </ul>
        </Form.Group>

        <Button className="mt-2" onClick={agregar}>
          Añadir al pedido
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MenuCard;
