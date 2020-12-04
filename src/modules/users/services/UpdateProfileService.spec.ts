import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

let fakeUsersRepository : FakeUsersRepository;
let fakeHashProvider : FakeHashProvider;
let updateProfileService : UpdateProfileService;

describe('Update Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able update the profile', async() => {
    const user = fakeUsersRepository.create({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    });

    const profile = await updateProfileService.execute({
      name: 'Jose Filho',
      email: 'josefr.almeidaads@gmail.com',
      old_password: '12345678',
      password: '1234567899',
      user_id: (await user).id,
    });

    expect(profile.name).toBe('Jose Filho');
    expect(profile.email).toBe('josefr.almeidaads@gmail.com');
  });

  it('should not be able update the profile within non-exists', async() => {
    await expect(updateProfileService.execute({
      name: 'Jose Filho',
      email: 'josefr.almeidaads@gmail.com',
      old_password: '123456789',
      password: '123456789',
      user_id: 'non-exists',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('it should not be able to change your email to another email existing', async() => {
     await fakeUsersRepository.create({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    });

    const user = await fakeUsersRepository.create({
      name: 'joao',
      email: 'ze.batera@gmail.com',
      password: '12345678',
    });

    await expect( updateProfileService.execute({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      old_password: '12345678',
      password: '1234567899',
      user_id: user.id,
    })).rejects.toBeInstanceOf(AppError);
    
  });

  it('Should be able to update the password', async() => {
    const user = await fakeUsersRepository.create({
      name: 'joao',
      email: 'ze.batera@gmail.com',
      password: '12345678',
    });

    const updateUser = await updateProfileService.execute({
      name: 'joao',
      email: 'ze.batera@gmail.com',
      password: '123456789',
      old_password: '12345678',
      user_id: user.id,
    });
    expect(updateUser.password).toBe('123456789');
  });

  it('Should not be able to update the password, with no informing the password old', async() => {
    const user = await fakeUsersRepository.create({
      name: 'joao',
      email: 'ze.batera@gmail.com',
      password: '12345678',
    });

    await expect( updateProfileService.execute({
      name: 'joao',
      email: 'ze.batera@gmail.com',
      password: '123456789',
      user_id: user.id,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update the password, with wrong old password', async() => {
    const user = await fakeUsersRepository.create({
      name: 'joao',
      email: 'ze.batera@gmail.com',
      password: '12345678',
    });

    await expect( updateProfileService.execute({
      name: 'joao',
      email: 'ze.batera@gmail.com',
      password: '123456789',
      old_password: '123123',
      user_id: user.id,
    })).rejects.toBeInstanceOf(AppError);
  });
});