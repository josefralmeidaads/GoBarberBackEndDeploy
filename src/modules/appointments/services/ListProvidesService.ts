import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from "@modules/users/infra/typeorm/entities/User";
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,
  ){}

  public async execute({ user_id }: IRequest): Promise<User[]>{
    let users: User[] = [];

    if(user_id){
      users = await this.userRepository.findAllProviders({ except_user_id: user_id });

      if(!users){
        throw new AppError('Users not exists');
      }
    }

    return users;
  }
}