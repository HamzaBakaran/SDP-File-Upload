import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, ListGroup } from 'react-bootstrap';
import useFiles from '../hooks/useFiles';
import { S3File } from '../utils/types';
import FileCard from '../components/File/FileCard';

const Dashboard = () => {
  const { data: files = [], isLoading, isError } = useFiles('');
  const [recentFiles, setRecentFiles] = useState<S3File[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [totalFiles, setTotalFiles] = useState<number>(0);

  useEffect(() => {
    if (files.length > 0) {
      const sortedFiles = files.filter(file => !file.key.endsWith('/')).sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      setRecentFiles(sortedFiles.slice(0, 3));
      setTotalFiles(files.length);
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      setTotalSize(totalSize);
    }
  }, [files]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (isError) {
    return <div>Error fetching files.</div>;
  }

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <Card className="text-white bg-primary mb-3" style={{ height: '150px' }}>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title>Total Files</Card.Title>
              <Card.Text className="display-4">{totalFiles}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-white bg-success mb-3" style={{ height: '150px' }}>
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title>Total Size</Card.Title>
              <Card.Text className="display-4">{(totalSize / (1024 * 1024)).toFixed(2)} MB</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Recent Files</Card.Title>
              <ListGroup variant="flush">
                {recentFiles.map((file, index) => (
                  <ListGroup.Item key={index}>
                    <FileCard file={file} />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
