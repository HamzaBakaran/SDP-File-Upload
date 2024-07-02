import appAxios from "./appAxios";
import { S3File } from "../utils/types";

const uploadFile = async (file: File, folderPath: string = ''): Promise<void> => {
  try {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('folderPath', folderPath.replace(/\/$/, '')); // Ensure no trailing slash

    const response = await appAxios.post('s3/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('File uploaded successfully:', response.data);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};


const listFiles = (folderPath?: string): Promise<S3File[]> => {
  return new Promise((resolve, reject) => {
    appAxios.get(`/s3/list`, { params: { folderPath } })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.error('Error listing files:', error);
        reject(error);
      });
  });
};

const createFolder = async (folderPath: string): Promise<void> => {
  try {
    const response = await appAxios.post('s3/create-folder', null, {
      params: { folderPath }
    });

    console.log('Folder created successfully:', response.data);
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

const moveFile = async (sourceKey: string, destinationKey: string): Promise<void> => {
  try {
    const response = await appAxios.post('s3/move-file', null, {
      params: { sourceKey, destinationKey }
    });

    console.log('File moved successfully:', response.data);
  } catch (error) {
    console.error('Error moving file:', error);
    throw error;
  }
};

const downloadFile = (key: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    appAxios.get(`/s3/download?key=${encodeURIComponent(key)}`, {
      responseType: 'blob'
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(error => {
      console.error('Error downloading file:', error);
      reject(error);
    });
  });
};

const deleteFile = (key: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    appAxios.delete('/s3/delete', { params: { key } })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        console.error('Error deleting file:', error);
        reject(error);
      });
  });
};

export default { uploadFile, listFiles, createFolder, moveFile, downloadFile, deleteFile };
