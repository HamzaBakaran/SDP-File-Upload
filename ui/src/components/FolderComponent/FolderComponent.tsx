import React from 'react';
import { Card, Button, Row, Col} from 'react-bootstrap';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface FolderProps {
  name: string;
  onClick: () => void;
  folderPath: string;
}

const FolderComponent: React.FC<FolderProps> = ({ name, onClick }) => {
  




  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={12} md={3} className="d-flex align-items-center justify-content-center">
            <div style={{ fontSize: '4em' }}>📁</div>
          </Col>
          <Col xs={12} md={9} className="d-flex flex-column justify-content-center">
            <Card.Title className="text-truncate text-center text-md-start" title={name}>{name}</Card.Title>
            <Row className="mt-3">
              <Col>
                <Button variant="primary" onClick={onClick} className="w-100">Open</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FolderComponent;
