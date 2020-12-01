import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUsersService from '@modules/users/services/AuthenticateUserService';
import CreateUsersService from '@modules/users/services/CreateUserService';

describe(' Authenticate User Service', () => {
  it('Should be able to authenticate', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider(); 
    
    const authenticateUserService = new AuthenticateUsersService(fakeUsersRepository, fakeHashProvider);
    const createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider);

    const user = await createUsersService.execute({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    });

    const response = await authenticateUserService.execute({
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Should not be able to authenticate with non existing user', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider(); 
    
    const authenticateUserService = new AuthenticateUsersService(fakeUsersRepository, fakeHashProvider);

    expect(authenticateUserService.execute({
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate within user password incorrect', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider(); 
    
    const authenticateUserService = new AuthenticateUsersService(fakeUsersRepository, fakeHashProvider);
    const createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider);

    const user = await createUsersService.execute({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    });

    expect(authenticateUserService.execute({
      email: 'ze.ssva.batera@gmail.com',
      password: '1234567',
    })).rejects.toBeInstanceOf(AppError);
    
  });
});