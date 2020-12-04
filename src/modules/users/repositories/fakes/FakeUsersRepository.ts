import { v4 } from 'uuid';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '@modules/users/infra/typeorm/entities/User';


class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined>{
      console.log('id ->', id);
      const user = this.users.find( user => user.id === id);
      console.log('teste ->', user);
      return user;
    }

    public async findByEmail(email: string): Promise<User | undefined>{
      const user = this.users.find( user => user.email === email);

      return user;
    }

    public async create(userData: ICreateUserDTO): Promise<User>{
      const user = new User;

      Object.assign(user, { id: v4() }, userData);

      this.users.push(user);

      return user;
    }

    public async save(user: User): Promise<User> {
      const findIndex = this.users.findIndex( findUser => findUser.id === user.id );

      this.users[findIndex] = user;

      return user;
    }

    public async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
      let findAllProvidersExceptUserId = this.users;

      if(except_user_id){
        findAllProvidersExceptUserId = this.users.filter( user => user.id !== except_user_id );
      }

      return findAllProvidersExceptUserId
    }
}

export default FakeUsersRepository;