
  export type UserType = {
    id: string;
    firstName: string;
    lastName: string;
    userType: 'ADMIN' | 'USER' | 'GUEST'; // Adjust the possible user types as needed
    email: string;
    userName: string;
  };
 
  export type File = {
    bucketName: string;
    key: string;
    size: number;
    lastModified: string;
    storageClass: string;
    owner: any; // You can define a type for owner if needed
    restoreStatus: any; // You can define a type for restoreStatus if needed
    etag: string;
  };
   
    
  
 