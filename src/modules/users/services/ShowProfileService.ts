import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from  '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest{
  user_id: string;
}


@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private userRespository: IUserRepository,
  ){}

  public async execute({ user_id }: IRequest): Promise<User | undefined>{
      const user = await this.userRespository.findById(user_id);

      if(!user){
        throw new AppError('User not Found')
      }
      return user;
  }
}