import appAxios from "./appAxios";
import { S3File } from "../utils/types";

const uploadFile = async (file: File): Promise<void> => {
    try {
        const formData: any = new FormData();
        formData.append('file', file);

        // Make a POST request to upload the file
        const response = await appAxios.post('s3/uploadauto', formData, {
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

const listFiles = (): Promise<S3File[]> => {
    return new Promise((resolve, reject) => {
        appAxios.get(`/s3/list`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error listing files:', error);
                reject(error);
            });
    });
};

const downloadFile = (key: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        appAxios.get(`/s3/download/${key}`, {
            responseType: 'blob'
        }).then(response => {
            resolve(response.data);
        }).catch(error => {
            console.error('Error downloading file:', error);
            reject(error);
        });
    });
};

const deleteFile = (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        appAxios.delete(`/s3/delete/${key}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting file:', error);
                reject(error);
            });
    });
};

export default {  uploadFile,listFiles, downloadFile, deleteFile };
