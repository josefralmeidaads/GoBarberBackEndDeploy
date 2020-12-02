import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUsersService from '@modules/users/services/UpdateAvatarUserService';

let fakeUsersRepository : FakeUsersRepository;
let fakeStorageProvider : FakeStorageProvider;
let updateUsersService : UpdateUsersService;

describe('Update User Avatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUsersService = new UpdateUsersService(fakeUsersRepository, fakeStorageProvider);
  });

  it('should be able update new User', async() => {
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
    expect(updateUsersService.execute({
      user_id: 'non-existing-user',
      avatarFileName: 'avatar.jpg'
     })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one avatar ', async() => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
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