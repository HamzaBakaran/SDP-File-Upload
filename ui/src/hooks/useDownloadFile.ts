import { useQuery } from 'react-query';
import { FileService } from '../services';

const useDownloadFile = (key: string) => {
    return useQuery(['downloadFile', key], () =>FileService.downloadFile(key), {
        enabled: false, 
        refetchOnWindowFocus: false,
    });
};

export default useDownloadFile;