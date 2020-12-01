import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUsersService from '@modules/users/services/CreateUserService';

describe('Create User Service', () => {

  it('should be able create new User', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider);

    const user = await createUsersService.execute({
      name: 'Jose Filho',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create user with email existent', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider);

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