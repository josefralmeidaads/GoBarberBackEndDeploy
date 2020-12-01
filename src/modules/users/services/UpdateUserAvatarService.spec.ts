import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUsersService from '@modules/users/services/UpdateAvatarUserService';

describe('Update User Avatar', () => {

  it('should be able update new User', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUsersService = new UpdateUsersService(fakeUsersRepository, fakeStorageProvider);

    const user = fakeUsersRepository.create({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    });

     await updateUsersService.execute({
     user_id: (await user).id,
     avatarFileName: 'avatar.jpg'
    });

    expect((await user).avatar).toBe('avatar.jpg');
  });

  it('should not be able update new user not existing', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUsersService = new UpdateUsersService(fakeUsersRepository, fakeStorageProvider);

    expect(updateUsersService.execute({
      user_id: 'non-existing-user',
      avatarFileName: 'avatar.jpg'
     })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one avatar ', async() => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUsersService = new UpdateUsersService(fakeUsersRepository, fakeStorageProvider);

    const user = fakeUsersRepository.create({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    });

     await updateUsersService.execute({
     user_id: (await user).id,
     avatarFileName: 'avatar.jpg'
    });

    await updateUsersService.execute({
      user_id: (await user).id,
      avatarFileName: 'avatar2.jpg'
     });

     expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    expect((await user).avatar).toBe('avatar2.jpg');
  });

});