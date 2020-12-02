import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUsersService from '@modules/users/services/AuthenticateUserService';
import CreateUsersService from '@modules/users/services/CreateUserService';

let fakeUsersRepository : FakeUsersRepository;
let fakeHashProvider : FakeHashProvider;
let authenticateUserService : AuthenticateUsersService;
let createUsersService: CreateUsersService;   

describe(' Authenticate User Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUserService = new AuthenticateUsersService(fakeUsersRepository, fakeHashProvider);
    createUsersService = new CreateUsersService(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to authenticate', async() => {
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
    expect(authenticateUserService.execute({
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate within user password incorrect', async() => {
    await createUsersService.execute({
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