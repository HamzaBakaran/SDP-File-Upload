import { S3File } from '../../utils/types';
import useFiles from '../../hooks/useFiles';
import FileCard from '../File/FileCard';
import { useState, useRef } from 'react';
import { Modal, Button, Spinner, Row, Col, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useFileUpload from '../../hooks/useUploadFile';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const FileList = () => {
  const { data: files = [], isLoading, isError } = useFiles(); // Use default value [] if files is undefined

  const uploadMutation = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    const files = fileInputRef.current?.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    } else {
      setSelectedFile(null); // Unselect the file if no file is selected
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        await uploadMutation.mutateAsync(selectedFile);
        toast.success('File uploaded successfully');
        setSelectedFile(null); // Reset selected file after successful upload
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Error uploading file';
        toast.error(`Error uploading file: ${errorMessage}`);
        console.error('Error uploading file:', error);
      } finally {
        setIsUploading(false);
      }
    }
    setShowModal(false); // Close the modal after upload
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedFile(null); // Reset selected file when closing modal
  };

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading indicator while data is fetching
  }

  if (isError) {
    return <div>Error fetching files.</div>; // Render an error message if fetching fails
  }

  return (
    <>
      <Container className="my-3">
        <Row className="align-items-center mb-3">
          <Col xs={3}></Col>
          <Col xs={6} className="text-center">
            <h2 className="mb-0">Your files</h2>
          </Col>
          <Col xs={3} className="text-end">
            <Button variant="secondary" onClick={() => setShowModal(true)}>Upload File</Button>
          </Col>
        </Row>
        <div className="files-list">
          {files.map((file: S3File, index: number) => (
            // Use the FileCard component for each file
            <FileCard key={index} file={file} className="mb-3" />
          ))}
        </div>
      </Container>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <Button className="btn btn-secondary mb-3" onClick={() => fileInputRef.current?.click()}>
            Select File
          </Button>
          {selectedFile && (
            <p>
              Selected File: {selectedFile.name}
              <Button className="btn btn-link" onClick={() => setSelectedFile(null)}>Clear Selection</Button>
            </p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Close</Button>
          <Button variant="primary" onClick={handleFileUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? <Spinner animation="border" size="sm" /> : 'Upload'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FileList;
