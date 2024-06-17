import { useState, useRef } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useFileUpload from '../../hooks/useUploadFile';
import 'react-toastify/dist/ReactToastify.css';

const UploadComponent = () => {
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

  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)}>Upload File</Button>

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
          <button
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </button>
          {selectedFile && (
            <p>
              Selected File: {selectedFile.name} 
              <button className="btn btn-link" onClick={() => setSelectedFile(null)}>Clear Selection</button>
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

export default UploadComponent;
