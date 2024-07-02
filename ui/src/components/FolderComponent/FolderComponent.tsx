import React, { useState } from 'react';
import { Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useDeleteFile from '../../hooks/useDeleteFile';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface FolderProps {
  name: string;
  onClick: () => void;
  folderPath: string;
}

const FolderComponent: React.FC<FolderProps> = ({ name, onClick, folderPath }) => {
  const deleteMutation = useDeleteFile();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Sanitize folderPath to ensure there are no double slashes or trailing slashes
      const sanitizedFolderPath = folderPath.replace(/\/{2,}/g, '/').replace(/\/+$/, '') + '/';
      await deleteMutation.mutateAsync(sanitizedFolderPath);
      toast.success('Folder deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting folder';
      toast.error(`Error deleting folder: ${errorMessage}`);
      console.error('Error deleting folder:', error);
    } finally {
      setIsDeleting(false);
    }
  };

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
                <Button variant="primary" onClick={onClick} className="w-100">
                  Open
                </Button>
              </Col>
              <Col>
                <Button variant="danger" onClick={handleDelete} disabled={isDeleting} className="w-100">
                  {isDeleting ? <Spinner animation="border" size="sm" /> : 'Delete'}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FolderComponent;
