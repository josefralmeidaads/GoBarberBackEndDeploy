import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    password?: string;
    old_password?: string;
}

@injectable()
class UpdateProfile {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ){}

    public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User>{
      const user = await this.usersRepository.findById(user_id);

      if(!user){
        throw new AppError('User not found');
      }

      user.name = name;

      const userFindEmail = await this.usersRepository.findByEmail(email);
      
      if(userFindEmail && userFindEmail.id !== user_id){
        throw new AppError('this email already exists, please insert a email not existing')
      }

      user.email = email;

      if(password && !old_password){
        throw new AppError('You need the inform your old password');
      }

      if(password && old_password){

        const checkpassword = await this.hashProvider.compareHash(old_password, user.password);

        if(!checkpassword){
          throw new AppError('Your old password not confere with current password');
        }

        user.password = await this.hashProvider.generateHash(password);
      }

      return await this.usersRepository.save(user);
    }
}

export default UpdateProfile;