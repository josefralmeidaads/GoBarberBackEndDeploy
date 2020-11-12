import { de } from 'date-fns/locale';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(request:Request , response:Response, next:NextFunction): void {
    const authHeader = request.headers.authorization; // recebo o token do meu header

    if(!authHeader){ // verifico se existe um token
        throw new Error('JWT token is missging!');
    }

    const [, token] = authHeader.split(' '); // separo as palavras Beare e Token acesso somente o token

    try{
      const decode = verify(token, authConfig.jwt.secret); // decodifico o token com a secret

      const { sub } = decode as TokenPayload; //forçando meu decode a ter a tipagem do TokenPayload

      request.user = { id: sub };

      return next();// se o token for validado ele pode listar e criar um agendamento
    }catch {
      throw new Error('JWT Token is invalid!');// se não, então não posso fazer nada!
    }
}