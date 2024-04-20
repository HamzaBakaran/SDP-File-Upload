import appAxios from "./appAxios";
import { File } from "../utils/types";

const listFiles = (): Promise<File[]> => {
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

export default {  listFiles, downloadFile, deleteFile };
