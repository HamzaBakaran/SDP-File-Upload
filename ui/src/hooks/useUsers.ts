import {useQuery } from 'react-query';
import { UserService } from '../services';

const useOrder = () => {
    return useQuery('orders',
    () => UserService.getUsers(),
    {refetchOnWindowFocus: false}
    );
}
export default useOrder;