import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';

import uploadConfig from './config/upload';
import './database';
import AppError from './errors/AppError';

import routes from './routes';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/files', express.static(uploadConfig.directory)); // mostrando a imagem salva na pasta tmp
app.use(routes);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError){ // verifico seu me erro e uma instância da minha classe erro
      return response.status(err.statusCode).json({ 
        status: 'error',
        message: err.message,
      });
    }

  console.error(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
});

app.listen(3333, () => {
    console.log('🏍 servidor iniciado na porta 3333!');
});