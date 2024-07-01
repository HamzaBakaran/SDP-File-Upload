import { useMutation, useQueryClient } from 'react-query';
import { FileService } from '../services';

const useFileUpload = () => {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation(({ file, folderPath }: { file: File, folderPath?: string }) => FileService.uploadFile(file, folderPath), {
    onSuccess: () => {
      queryClient.invalidateQueries('s3Files');
    }
  });

  return uploadMutation;
};

export default useFileUpload;
