import { S3File } from '../../utils/types';
import useFiles from '../../hooks/useFiles';
import FolderComponent from '../FolderComponent';
import FileCard from '../File/FileCard';
import { useState, useRef } from 'react';
import { Button, Row, Col, Container, Modal, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useFileUpload from '../../hooks/useUploadFile';
import fileService from '../../services/file';
import { ArrowLeft } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const FolderList = () => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const { data: files = [], isLoading, isError, refetch } = useFiles(currentPath);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderSearchQuery, setFolderSearchQuery] = useState('');
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useFileUpload();

  const handleCreateFolder = async () => {
    try {
      const sanitizedPath = currentPath.replace(/\/$/, '');
      await fileService.createFolder(sanitizedPath ? `${sanitizedPath}/${newFolderName}` : newFolderName);
      toast.success('Folder created successfully');
      setNewFolderName('');
      setShowCreateFolderModal(false);
      refetch(); // Refetch the files after creating the folder
    } catch (error) {
      toast.error('Error creating folder');
      console.error('Error creating folder:', error);
    }
  };

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
        // Ensure currentPath does not end with a slash
        const folderPath = currentPath.replace(/\/$/, '');
        await uploadMutation.mutateAsync({ file: selectedFile, folderPath });
        toast.success('File uploaded successfully');
        setSelectedFile(null); // Reset selected file after successful upload
        refetch(); // Refetch the files after uploading
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Error uploading file';
        toast.error(`Error uploading file: ${errorMessage}`);
        console.error('Error uploading file:', error);
      } finally {
        setIsUploading(false);
      }
    }
    setShowUploadModal(false); // Close the modal after upload
  };

  const handleFolderClick = (folder: string) => {
    const sanitizedPath = folder.replace(/\/$/, '');
    setCurrentPath(sanitizedPath);
  };

  const getFolders = () => {
    const folderMap = new Map<string, string>();
    files.forEach(file => {
      const relativePath = file.key.replace(/^[^/]+/, ''); // Remove the email part from the path
      const folderPath = relativePath.split('/').slice(0, -1).join('/');
      const fullPath = `${currentPath ? currentPath + '/' : ''}${folderPath}`;
      if (folderPath.startsWith(currentPath) && folderPath !== currentPath) {
        folderMap.set(folderPath, fullPath);
      }
    });
    return Array.from(folderMap.entries());
  };

  const getFilesInCurrentPath = () => {
    return files.filter(file => {
      const relativePath = file.key.replace(/^[^/]+/, ''); // Remove the email part from the path
      return relativePath.startsWith(currentPath) && relativePath.split('/').length === currentPath.split('/').length + 1;
    });
  };

  const folders = getFolders();
  const filesInCurrentPath = getFilesInCurrentPath();

  const getFilteredFolders = () => {
    return folders.filter(([folder]) => folder.toLowerCase().includes(folderSearchQuery.toLowerCase()));
  };

  const getFilteredFiles = () => {
    return filesInCurrentPath.filter(file => file.key.toLowerCase().includes(fileSearchQuery.toLowerCase()));
  };

  const filteredFolders = getFilteredFolders();
  const filteredFiles = getFilteredFiles();

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (isError) {
    return <div>Error fetching folders and files.</div>;
  }

  return (
    <Container className="my-3">
      <Row className="align-items-center mb-3">
        <Col xs={12} md={2}>
          {currentPath && (
            <Button variant="outline-secondary" className="d-flex align-items-center" onClick={() => setCurrentPath(currentPath.split('/').slice(0, -1).join('/'))}>
              <ArrowLeft className="me-2" /> Back
            </Button>
          )}
        </Col>
        <Col xs={12} md={10}>
          <InputGroup className="w-100">
            <FormControl
              type="text"
              placeholder={currentPath ? 'Search files...' : 'Search folders...'}
              value={currentPath ? fileSearchQuery : folderSearchQuery}
              onChange={e => (currentPath ? setFileSearchQuery(e.target.value) : setFolderSearchQuery(e.target.value))}
              className="me-2 flex-grow-1"
            />
            <Button variant="secondary" onClick={() => setShowCreateFolderModal(true)}>Create Folder</Button>
            {currentPath && (
              <Button variant="secondary" onClick={() => setShowUploadModal(true)} className="ms-2">Upload File</Button>
            )}
          </InputGroup>
        </Col>
      </Row>
      <div className="folders-list">
        {!currentPath && filteredFolders.map(([folder, fullPath], index) => (
          <div key={index}>
            <FolderComponent
              name={folder.split('/').pop() || ''}
              onClick={() => handleFolderClick(folder)}
              folderPath={fullPath} // Pass the full path for deletion
            />
          </div>
        ))}
        {currentPath && filteredFiles.map((file: S3File, index: number) => (
          <div key={index}>
            <FileCard file={file} className="mb-3" />
          </div>
        ))}
      </div>

      <Modal show={showCreateFolderModal} onHide={() => setShowCreateFolderModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateFolderModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleCreateFolder} disabled={!newFolderName}>Create</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
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
          <Button className="btn btn-secondary mb-3" onClick={() => fileInputRef.current?.click()}>Select File</Button>
          {selectedFile && (
            <p>
              Selected File: {selectedFile.name}
              <Button className="btn btn-link" onClick={() => setSelectedFile(null)}>Clear Selection</Button>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleFileUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? <Spinner animation="border" size="sm" /> : 'Upload'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FolderList;
