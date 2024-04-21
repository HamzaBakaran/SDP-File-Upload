
import { S3File } from '../../utils/types';
import useFiles from '../../hooks/useFiles';
import FileCard from '../File/FileCard';

const FileList = () => {
  const { data: files = [], isLoading, isError } = useFiles(); // Use default value [] if files is undefined

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading indicator while data is fetching
  }

  if (isError) {
    return <div>Error fetching files.</div>; // Render an error message if fetching fails
  }

  return (
    <div className="files-list">
      <h2>Files List</h2>
      {files.map((file: S3File, index: number) => (
        // Use the FileCard component for each file
        <FileCard key={index} file={file} />
      ))}
    </div>
  );
};

export default FileList;
