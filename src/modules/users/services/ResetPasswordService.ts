import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

interface IRequest {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
    constructor(
      @inject('UsersRepository')
      private usersRepository: IUsersRepository,

      @inject('MailProvider')
      private mailProvider: IMailProvider,

      @inject('UserTokensRepository')
      private userTokensRepository: IUserTokensRepository,

      @inject('HashProvider')
      private hashProvider: IHashProvider,

    ){}
    public async execute({ token , password }: IRequest): Promise<void> {
      const userToken = await this.userTokensRepository.findByToken(token);

      if(!userToken){
        throw new AppError('User token does not exists');
      }

      const user = await this.usersRepository.findById(userToken.user_id);

      if(!user){
        throw new AppError('User does not Exists');
      }

      const tokenCreateAt = userToken.created_at;
      const compareDate = addHours(tokenCreateAt, 2);
      
      if(isAfter(Date.now(), compareDate)){
        throw new AppError('Token Expired');
      }

      user.password = await this.hashProvider.generateHash(password);

      await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;