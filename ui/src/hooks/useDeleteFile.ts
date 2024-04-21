import { useMutation, useQueryClient } from 'react-query';
import { FileService } from '../services';

const useDeleteFile = () => {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation((key: string) => FileService.deleteFile(key), {
        onSuccess: () => {
            queryClient.invalidateQueries('s3Files');
        }
    });

    return deleteMutation;
};

export default useDeleteFile;
