import { useState } from 'react';
import { toast } from 'react-toastify';
import useDeleteFile from '../../hooks/useDeleteFile';
import useMoveFile from '../../hooks/useMoveFile';
import { S3File } from '../../utils/types';
import { Spinner, Card, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import fileService from '../../services/file';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

type FileCardProps = {
  file: S3File;
  className?: string; // Add className prop
};

const FileCard = ({ file, className }: FileCardProps) => {
  const { key, size, lastModified } = file;
  const deleteMutation = useDeleteFile();
  const moveMutation = useMoveFile();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [availableFolders, setAvailableFolders] = useState<string[]>([]);
  const [targetFolder, setTargetFolder] = useState('');
  const [isMoving, setIsMoving] = useState(false);



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

  const handleMoveClick = async () => {
    setShowMoveModal(true);
    try {
      const folders = await fileService.listFiles(); // Fetch all files and folders
      const folderPaths = folders.filter(f => f.key.endsWith('/')).map(f => f.key);
      setAvailableFolders(folderPaths);
    } catch (error) {
      toast.error('Error fetching folders');
    }
  };

  const handleMoveFile = async () => {
    if (targetFolder) {
      setIsMoving(true);
      try {
        await moveMutation.mutateAsync({ sourceKey: key, destinationKey: `${targetFolder}${key.split('/').pop()}` });
        toast.success(`File moved to ${targetFolder} successfully`);
        setShowMoveModal(false);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Error moving file';
        toast.error(`Error moving file: ${errorMessage}`);
        console.error('Error moving file:', error);
      } finally {
        setIsMoving(false);
      }
    }
  };

  const getPreviewImageUrl = (fileKey: string) => {
    const fileExtension = fileKey.split('.').pop()?.toLowerCase();
    if (fileKey.endsWith('/')) {
      return ''; // No URL for folder, we'll use the emoji
    }
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
  const fileName = key.endsWith('/') ? key.split('/').slice(-2, -1)[0] : key.split('/').pop();

  // Function to copy the download link to the clipboard
  const handleShare = async () => {
    const downloadLink = `http://localhost:8080/api/s3/download?key=${encodeURIComponent(key)}`;
    try {
      await navigator.clipboard.writeText(downloadLink);
      toast.success('Download link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy download link');
      console.error('Error copying download link:', error);
    }
  };

  return (
    <>
      <Card className={`mb-3 shadow-sm ${className}`}>
        <Card.Body>
          <Row>
            <Col md={3} className="d-flex align-items-center justify-content-center justify-content-md-start">
              {key.endsWith('/') ? (
                <div style={{ fontSize: '4em' }}>📁</div>
              ) : (
                <img 
                  src={getPreviewImageUrl(key)} 
                  alt="File preview" 
                  className="img-fluid rounded my-3" // Added my-3 for vertical margin
                  style={{ maxHeight: '150px' }}
                />
              )}
            </Col>
            <Col md={9} className="d-flex flex-column justify-content-center">
              <Card.Title className="text-truncate" title={fileName}>{fileName}</Card.Title>
              {key.endsWith('/') ? (
                <Row className="mt-3 gx-2 gy-2">
                  <Col xs={12} sm={6}>
                    <Button variant="danger" onClick={handleDelete} disabled={isDeleting} className="w-100">
                      {isDeleting ? <Spinner animation="border" size="sm" /> : 'Delete Folder'}
                    </Button>
                  </Col>
                </Row>
              ) : (
                <>
                  <Card.Text>
                    <Row>
                      <Col className="text-muted"><strong>Size:</strong> {convertBytesToKB(size)}</Col>
                    </Row>
                    <Row>
                      <Col className="text-muted"><strong>Last Modified:</strong> {new Date(lastModified).toLocaleString()}</Col>
                    </Row>
                  </Card.Text>
                  <Row className="mt-3 gx-2 gy-2">
                    <Col xs={12} sm={6}>
                      <Button variant="primary" onClick={handleDownload} disabled={isDownloading} className="w-100">
                        {isDownloading ? <Spinner animation="border" size="sm" /> : 'Download'}
                      </Button>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Button variant="danger" onClick={handleDelete} disabled={isDeleting} className="w-100">
                        {isDeleting ? <Spinner animation="border" size="sm" /> : 'Delete'}
                      </Button>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Button variant="secondary" onClick={handleMoveClick} className="w-100">
                        Move 
                      </Button>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Button variant="info" onClick={handleShare} className="w-100">
                        Share
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={showMoveModal} onHide={() => setShowMoveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Move file</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Target Folder</Form.Label>
            <Form.Control
              as="select"
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
            >
              <option value="">Select a folder</option>
              {availableFolders.map((folder, index) => (
                <option key={index} value={folder}>{folder}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMoveModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleMoveFile} disabled={isMoving || !targetFolder}>
            {isMoving ? <Spinner animation="border" size="sm" /> : 'Move File'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FileCard;
