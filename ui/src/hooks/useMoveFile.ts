import { useMutation, useQueryClient } from 'react-query';
import fileService from '../services/file';

const useMoveFile = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ sourceKey, destinationKey }: { sourceKey: string; destinationKey: string }) => fileService.moveFile(sourceKey, destinationKey),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('s3Files');
      },
    }
  );
};

export default useMoveFile;
