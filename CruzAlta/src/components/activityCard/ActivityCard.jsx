const ActivityCard = ({ image, title, description }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={image} style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body className="text-center">
        <Card.Title className="fw-bold">{title}</Card.Title>
        <Card.Text className="text-muted">
          {description}
        </Card.Text>
      </Card.Body>
    </Card>
  );

};

export default ActivityCard;