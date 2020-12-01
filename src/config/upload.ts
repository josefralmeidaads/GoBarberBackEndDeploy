import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default{
    tmpFolder,
    uploadsFolder: path.resolve(tmpFolder, 'uploads'),

    storage: multer.diskStorage({
      destination: tmpFolder,
      filename: (request, file, callback) => {
        const fileHash = crypto.randomBytes(10).toString('hex'); // gerando um criptografica em string
        const fileName = `${fileHash}-${file.originalname}`; // gerando o nome do arquivo com essa criptografia para dexiar o nome aleatorio

        return callback(null, fileName);
      }
    }),
};