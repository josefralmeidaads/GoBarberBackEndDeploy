import AppError from '@shared/errors/AppError';
import FakeICacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidesService';

let fakeUsersRepository : FakeUsersRepository;
let fakeICacheProvider: FakeICacheProvider;
let listProvidersService : ListProvidersService;

describe('Show Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeICacheProvider = new FakeICacheProvider();
    listProvidersService = new ListProvidersService(fakeUsersRepository, fakeICacheProvider);
  });

  it('it should be able to list the providers', async() => {
    const user1 = await fakeUsersRepository.create({
      name: 'Jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Leo',
      email: 'lecoleocvieira@gmail.com',
      password: '12345678',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Hudson',
      email: 'hudson.massi@gmail.com',
      password: '12345678',
    });

    const providers = await listProvidersService.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });

});