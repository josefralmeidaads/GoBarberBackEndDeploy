import AppError from '@shared/errors/AppError';
import FakeICacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUsersService from '@modules/users/services/AuthenticateUserService';

let fakeUsersRepository : FakeUsersRepository;
let fakeHashProvider : FakeHashProvider;
let fakeICacheProvider: FakeICacheProvider;
let authenticateUserService : AuthenticateUsersService;
  
describe(' Authenticate User Service', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeICacheProvider = new FakeICacheProvider();
    authenticateUserService = new AuthenticateUsersService(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able to authenticate', async() => {
    const user = await fakeUsersRepository.create({
      name: 'Jose Francisco',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    })

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
    await fakeUsersRepository.create({
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