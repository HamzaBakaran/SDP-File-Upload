import { useState } from 'react';
import { toast } from 'react-toastify';
import useDeleteFile from '../../hooks/useDeleteFile';
import { S3File } from '../../utils/types';
import { Spinner, Card, Button, Row, Col } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

type FileCardProps = {
  file: S3File;
  className?: string; // Add className prop
}

const FileCard = ({ file, className }: FileCardProps) => {
  const { key, size, lastModified } = file;
  const deleteMutation = useDeleteFile();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to convert file size from bytes to kilobytes
  const convertBytesToKB = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(key);
      toast.success('File deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting file';
      toast.error(`Error deleting file: ${errorMessage}`);
      console.error('Error deleting file:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/s3/download?key=${encodeURIComponent(key)}`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = key; // Set the filename here
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('File downloaded successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error downloading file';
      toast.error(`Error downloading file: ${errorMessage}`);
      console.error('Error downloading file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getPreviewImageUrl = (fileKey: string) => {
    const fileExtension = fileKey.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension || '')) {
      return `http://localhost:8080/api/s3/download?key=${encodeURIComponent(fileKey)}`;
    }
    if (fileExtension === 'pdf') {
      return 'https://via.placeholder.com/150/FF0000/FFFFFF?text=PDF+File'; // Red for PDF
    }
    if (['doc', 'docx'].includes(fileExtension || '')) {
      return 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Word+File'; // Blue for Word
    }
    if (['xls', 'xlsx'].includes(fileExtension || '')) {
      return 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Excel+File'; // Green for Excel
    }
    if (fileExtension === 'txt') {
      return 'https://via.placeholder.com/150/AAAAAA/FFFFFF?text=Text+File'; // Gray for Text
    }
    return 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Preview'; // Default color
  };

  // Extract the file name after the last '/'
  const fileName = key.split('/').pop();

  return (
    <Card className={`mb-3 shadow-sm ${className}`}>
      <Card.Body>
        <Row>
          <Col md={3} className="d-flex align-items-center justify-content-center justify-content-md-start">
            <img 
              src={getPreviewImageUrl(key)} 
              alt="File preview" 
              className="img-fluid rounded my-3" // Added my-3 for vertical margin
              style={{ maxHeight: '150px' }}
            />
          </Col>
          <Col md={9} className="d-flex flex-column justify-content-center">
            <Card.Title className="text-truncate" title={fileName}>{fileName}</Card.Title>
            <Card.Text>
              <Row>
                <Col className="text-muted"><strong>Size:</strong> {convertBytesToKB(size)}</Col>
              </Row>
              <Row>
                <Col className="text-muted"><strong>Last Modified:</strong> {new Date(lastModified).toLocaleString()}</Col>
              </Row>
            </Card.Text>
            <Row className="mt-3">
              <Col>
                <Button variant="primary" onClick={handleDownload} disabled={isDownloading} className="w-100">
                  {isDownloading ? <Spinner animation="border" size="sm" /> : 'Download'}
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

export default FileCard;
