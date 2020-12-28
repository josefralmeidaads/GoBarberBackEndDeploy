import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from "@modules/users/infra/typeorm/entities/User";
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { classToClass } from 'class-transformer';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ){}

  public async execute({ user_id }: IRequest): Promise<User[]>{
    let cacheUsers = await this.cacheProvider.recover<User[]>(`providers_list:${user_id}`);
    //let cacheUsers = null;
    let users: User[] = [];

    if(!cacheUsers){
      if(user_id){
        users = await this.userRepository.findAllProviders({ except_user_id: user_id });
  
        if(!users){
          throw new AppError('Users not exists');
        }
      }
      console.log('A query no banco foi feita!');
      await this.cacheProvider.save(`providers_list:${user_id}`, classToClass(users));
    }

    if(cacheUsers){
      console.log('usei cache')
      return cacheUsers;
    }

    return users;
  }
}