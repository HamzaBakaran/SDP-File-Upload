import {useQuery } from 'react-query';
import { FileService } from '../services';

const useFiles = () => {
    return useQuery('s3Files',
    () => FileService.listFiles(),
    {refetchOnWindowFocus: false}
    );
}
export default useFiles;