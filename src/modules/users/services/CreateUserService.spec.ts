import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUsersService from '@modules/users/services/CreateUserService';

let fakeUsersRepository : FakeUsersRepository;
let fakeHashProvider : FakeHashProvider;
let createUsersService : CreateUsersService;

describe('Create User Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able create new User', async() => {
    const user = await createUsersService.execute({
      name: 'Jose Filho',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create user with email existent', async() => {
      await createUsersService.execute({
      name: 'Jose Filho',
      email: 'jose@gmail.com',
      password: '12345678',
    });

    expect( createUsersService.execute({
      name: 'Jose Filho',
      email: 'jose@gmail.com',
      password: '12345678',
    })
    ).rejects.toBeInstanceOf(AppError);
  });

});