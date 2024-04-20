import {useQuery } from 'react-query';
import { FileService } from '../services';

const useFiles = () => {
    return useQuery('products',
    () => FileService.listFiles(),
    {refetchOnWindowFocus: false}
    );
}
export default useFiles;