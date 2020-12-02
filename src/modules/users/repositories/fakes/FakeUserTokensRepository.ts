import { v4 } from 'uuid';
import AppError from '@shared/errors/AppError';
import IUsersTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';


class FakeUserTokensRepository implements IUsersTokensRepository {
    private userTokens: UserToken[] = [];

    public async generate(user_id: string): Promise<UserToken>{
      const userToken = new UserToken();

      Object.assign(userToken, {
        id: v4(),
        token: v4(),
        user_id,
        created_at: new Date(),
        updated_at: new Date(),
      })

      this.userTokens.push(userToken);

      return userToken
    }

    public async findByToken(token: string): Promise<UserToken | undefined >{
    
      const userToken = this.userTokens.find( findToken => findToken.token === token);
      
      if(!userToken?.token){
        throw new AppError("This token does not exists");
      }

      return userToken;
    }
}

export default FakeUserTokensRepository;