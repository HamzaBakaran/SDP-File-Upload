
import { S3File } from '../../utils/types';

type FileCardProps = {
    file: S3File;
}

const FileCard = ({ file }: FileCardProps) => {
  const { key, size, lastModified } = file;

  // Function to convert file size from bytes to kilobytes
  const convertBytesToKB = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{key}</h5>
        <p className="card-text">Size: {convertBytesToKB(size)}</p>
        <p className="card-text">Last Modified: {new Date(lastModified).toLocaleString()}</p>
        <a href={`http://yourapi.com/download/${key}`} className="btn btn-primary" download>Download</a>
      </div>
    </div>
  );
};

export default FileCard;
