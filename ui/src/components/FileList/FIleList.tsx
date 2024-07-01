import { S3File } from '../../utils/types';
import useFiles from '../../hooks/useFiles';
import FileCard from '../File/FileCard';
import { useState, useRef } from 'react';
import { Modal, Button, Spinner, Row, Col, Container, FormControl, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useFileUpload from '../../hooks/useUploadFile';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const FileList = () => {
  const { data: files = [], isLoading, isError } = useFiles(''); // Use default value [] if files is undefined

  const uploadMutation = useFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [extensionFilter, setExtensionFilter] = useState(''); // State for extension filter
  const [sortOption, setSortOption] = useState('nameAsc'); // State for sorting option
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [folderPath, setFolderPath] = useState<string>(''); // State for folder path

  const fixedExtensions = ['.txt', '.pdf', '.jpg', '.png', '.docx']; // List of fixed extensions

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
        await uploadMutation.mutateAsync({ file: selectedFile, folderPath });
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleExtensionFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setExtensionFilter(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const isFile = (key: string) => {
    return !key.endsWith('/');
  };

  const getFilteredFiles = () => {
    return files
      .filter(file => {
        const matchesSearchQuery = file.key.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesExtensionFilter = extensionFilter === '' || file.key.toLowerCase().endsWith(extensionFilter.toLowerCase());
        return isFile(file.key) && matchesSearchQuery && matchesExtensionFilter;
      })
      .sort((a, b) => {
        if (sortOption === 'nameAsc') {
          return a.key.localeCompare(b.key);
        } else if (sortOption === 'nameDesc') {
          return b.key.localeCompare(a.key);
        } else if (sortOption === 'dateAsc') {
          return new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
        } else if (sortOption === 'dateDesc') {
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        }
        return 0;
      });
  };

  const filteredFiles = getFilteredFiles();

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
          <Col xs={12} md={3}>
            <FormControl
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="mb-2 mb-md-0"
            />
          </Col>
          <Col xs={12} md={3}>
            <Form.Select value={extensionFilter} onChange={handleExtensionFilterChange} className="mb-2 mb-md-0">
              <option value="">All Extensions</option>
              {fixedExtensions.map((ext, index) => (
                <option key={index} value={ext}>{ext}</option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={3}>
            <Form.Select value={sortOption} onChange={handleSortChange} className="mb-2 mb-md-0">
              <option value="nameAsc">Name Ascending</option>
              <option value="nameDesc">Name Descending</option>
              <option value="dateAsc">Date Ascending</option>
              <option value="dateDesc">Date Descending</option>
            </Form.Select>
          </Col>
          <Col xs={12} md={3} className="text-end">
            <Button variant="secondary" onClick={() => setShowModal(true)} className="w-100">Upload File</Button>
          </Col>
        </Row>
        <div className="files-list">
          {filteredFiles.map((file: S3File, index: number) => (
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
          <FormControl
            type="text"
            placeholder="Folder path (optional)"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
          />
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
