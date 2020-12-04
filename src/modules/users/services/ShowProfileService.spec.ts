import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

let fakeUsersRepository : FakeUsersRepository;
let showProfileService : ShowProfileService;

describe('Show Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('it should be able list current user', async() => {
    const user = await fakeUsersRepository.create({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    });

    const profile = await fakeUsersRepository.findById(user.id);

    expect(profile?.name).toBe('jose');
    expect(profile?.email).toBe('ze.ssva.batera@gmail.com');
  });

  it('it should not be able list user non-exists', async() => {
     await expect(showProfileService.execute({ user_id: 'non-exists' })).rejects.toBeInstanceOf(AppError);
  });
});