
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero-image.jpg';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/register');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <Card className="shadow p-3">
            <div className="d-flex justify-content-center">
              <Card.Img 
                variant="top" 
                src={heroImage} 
                alt="Cloud Storage" 
                className="img-fluid" 
                style={{ maxHeight: '40%', width: '60%' }}
              />
            </div>
            <Card.Body className="text-center">
              <Card.Title>Welcome to Cloud File Upload</Card.Title>
              <Card.Text>
                Your secure and reliable cloud storage solution.
              </Card.Text>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleGetStartedClick}
              >
                Get Started
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Container className="mt-5">
        <Row className="text-center">
          <Col md={4} className="mb-4">
            <h3>Secure Storage</h3>
            <p>All your files are securely stored and encrypted.</p>
          </Col>
          <Col md={4} className="mb-4">
            <h3>Easy Access</h3>
            <p>Access your files from anywhere, on any device.</p>
          </Col>
          <Col md={4} className="mb-4">
            <h3>Fast Uploads</h3>
            <p>Quick and efficient file uploads with no hassle.</p>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Home;
