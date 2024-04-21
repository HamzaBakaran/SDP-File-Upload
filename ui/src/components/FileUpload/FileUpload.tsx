import { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import useFileUpload from '../../hooks/useUploadFile';

const UploadComponent = () => {
  const uploadMutation = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
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
      try {
        await uploadMutation.mutateAsync(selectedFile);
        console.log('File uploaded successfully');
        setSelectedFile(null); // Reset selected file after successful upload
      } catch (error) {
        console.error('Error uploading file:', error);
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
          <Button variant="primary" onClick={handleFileUpload} disabled={!selectedFile}>Upload</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UploadComponent;
