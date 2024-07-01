import { S3File } from '../../utils/types';
import useFiles from '../../hooks/useFiles';
import FolderComponent from '../FolderComponent';
import FileCard from '../File/FileCard';
import { useState } from 'react';
import { Button, Row, Col, Container, Modal, FormControl, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import fileService from '../../services/file';
import 'bootstrap/dist/css/bootstrap.min.css';

const FolderList = () => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const { data: files = [], isLoading, isError } = useFiles(currentPath);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateFolder = async () => {
    try {
      await fileService.createFolder(currentPath ? `${currentPath}/${newFolderName}` : newFolderName);
      toast.success('Folder created successfully');
      setNewFolderName('');
      setShowCreateFolderModal(false);
    } catch (error) {
      toast.error('Error creating folder');
      console.error('Error creating folder:', error);
    }
  };

  const getFolders = () => {
    const folderSet = new Set<string>();
    files.forEach(file => {
      const relativePath = file.key.replace(/^[^/]+/, ''); // Remove the email part from the path
      const folderPath = relativePath.split('/').slice(0, -1).join('/');
      if (folderPath.startsWith(currentPath) && folderPath !== currentPath) {
        folderSet.add(folderPath);
      }
    });
    return Array.from(folderSet);
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
    return folders.filter(folder => folder.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const filteredFolders = getFilteredFolders();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching folders and files.</div>;
  }

  return (
    <Container className="my-3">
      <Row className="align-items-center mb-3">
        <Col>
          {currentPath && (
            <Button variant="link" onClick={() => setCurrentPath(currentPath.split('/').slice(0, -1).join('/'))}>
              🔙 Back
            </Button>
          )}
        </Col>
        <Col xs={15}>
          <InputGroup className="w-100">
            <FormControl
              type="text"
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="me-2"
            />
            <Button variant="secondary" onClick={() => setShowCreateFolderModal(true)}>Create Folder</Button>
          </InputGroup>
        </Col>
      </Row>
      <div className="folders-list">
        {!currentPath && filteredFolders.map((folder, index) => (
          <div key={index}>
            <FolderComponent
              name={folder.split('/').pop() || ''}
              onClick={() => setCurrentPath(folder)}
              folderPath={folder} // Pass the folderPath prop
            />
          </div>
        ))}
        {currentPath && filesInCurrentPath.map((file: S3File, index: number) => (
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
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateFolderModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleCreateFolder} disabled={!newFolderName}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FolderList;
