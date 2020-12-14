import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'disk' | 's3';

  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {},
    aws: {
      bucket: string;
    },
  };
};

export default {
    driver: process.env.STORAGE_DRIVER,

    tmpFolder,
    uploadsFolder: path.resolve(tmpFolder, 'uploads'),

    multer: {
      storage: multer.diskStorage({
        destination: tmpFolder,
        filename: (request, file, callback) => {
          const fileHash = crypto.randomBytes(10).toString('hex'); // gerando um criptografica em string
          const fileName = `${fileHash}-${file.originalname}`; // gerando o nome do arquivo com essa criptografia para dexiar o nome aleatorio
  
          return callback(null, fileName);
        }
      }),
    },

    config: {
      disk: {},
      aws: {
        bucket: 'centralbarber',
      }
    },
} as IUploadConfig;