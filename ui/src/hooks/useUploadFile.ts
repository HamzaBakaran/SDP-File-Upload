import { useMutation, useQueryClient } from 'react-query';
import { FileService } from '../services';

const useFileUpload = () => {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation(FileService.uploadFile, {
    onSuccess: () => {
      // Invalidate and refetch the files query to update the file list after upload
      queryClient.invalidateQueries('s3Files');
    },
  });

    return uploadMutation;
}

export default useFileUpload;
