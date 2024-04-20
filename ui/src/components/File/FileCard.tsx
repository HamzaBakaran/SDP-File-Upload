import React from 'react';
import { File } from '../../utils/types';

// FileCard Component
type FileCardProps = {
    file: File;
}

const FileCard = ({ file }: FileCardProps) => {
  const { key, size, lastModified } = file;

  // Function to convert file size from bytes to kilobytes
  const convertBytesToKB = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  return (
    <div className="file">
      <h3>{key}</h3>
      <p>Size: {convertBytesToKB(size)}</p>
      <p>Last Modified: {new Date(lastModified).toLocaleString()}</p>
    </div>
  );
};

export default FileCard;
