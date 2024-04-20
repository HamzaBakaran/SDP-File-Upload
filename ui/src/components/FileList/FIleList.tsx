import React from 'react';
import { File } from '../../utils/types';
import { useFiles } from "../../hooks"

const FileList = () => {
  const { data: files, isLoading, isError } = useFiles(); // Invoke the useFiles hook

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading indicator while data is fetching
  }

  if (isError) {
    return <div>Error fetching files.</div>; // Render an error message if fetching fails
  }

  return (
    <div className="files-list">
      <h2>Files List</h2>
      {files.map((file: File, index: number) => ( // Explicitly type the file parameter
        <div key={index} className="file">
          <h3>{file.key}</h3>
          <p>Size: {file.size}</p>
          <p>Last Modified: {new Date(file.lastModified).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default FileList;
