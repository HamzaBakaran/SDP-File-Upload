import { useQuery } from 'react-query';
import fileService from '../services/file';
import { S3File } from '../utils/types';

const useFiles = (folderPath: string='') => {
  return useQuery<S3File[], Error>(
    ['s3Files', folderPath],
    () => fileService.listFiles(folderPath ? folderPath.replace(/^\//, '') : ''),
    { refetchOnWindowFocus: false }
  );
};

export default useFiles;
