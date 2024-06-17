import { useState } from 'react';
import { toast } from 'react-toastify';
//import useDownloadFile from '../../hooks/useDownloadFile';
import useDeleteFile from '../../hooks/useDeleteFile';
import { S3File } from '../../utils/types';
import { Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

type FileCardProps = {
  file: S3File;
}

const FileCard = ({ file }: FileCardProps) => {
  const { key, size, lastModified } = file;
  const deleteMutation = useDeleteFile();
  //const downloadQuery = useDownloadFile(key); // Use the useDownloadFile hook
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

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{key}</h5>
        <p className="card-text">Size: {convertBytesToKB(size)}</p>
        <p className="card-text">Last Modified: {new Date(lastModified).toLocaleString()}</p>
        <button className="btn btn-primary" onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? <Spinner animation="border" size="sm" /> : 'Download'}
        </button>
        <button className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? <Spinner animation="border" size="sm" /> : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default FileCard;
