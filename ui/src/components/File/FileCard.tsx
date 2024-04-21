
import useDownloadFile from '../../hooks/useDownloadFile';
import useDeleteFile from '../../hooks/useDeleteFile';
import { S3File } from '../../utils/types';

type FileCardProps = {
  file: S3File;
}

const FileCard = ({ file }: FileCardProps) => {
  const { key, size, lastModified } = file;
  const deleteMutation = useDeleteFile();
  const downloadQuery = useDownloadFile(key); // Use the useDownloadFile hook

  // Function to convert file size from bytes to kilobytes
  const convertBytesToKB = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(key);
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

const handleDownload = async () => {
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
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{key}</h5>
        <p className="card-text">Size: {convertBytesToKB(size)}</p>
        <p className="card-text">Last Modified: {new Date(lastModified).toLocaleString()}</p>
        <button className="btn btn-primary" onClick={handleDownload} disabled={downloadQuery.isLoading}>Download</button>
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default FileCard;
