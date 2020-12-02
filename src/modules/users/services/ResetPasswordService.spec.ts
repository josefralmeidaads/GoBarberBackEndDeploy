import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetePasswordService', () => {
  beforeEach(() => {
     fakeUsersRepository = new FakeUsersRepository();
     fakeUserTokensRepository = new FakeUserTokensRepository();
     fakeMailProvider = new FakeMailProvider();
     fakeHashProvider = new FakeHashProvider();
     resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository, fakeHashProvider);
  });

  it('should be able to reset password', async() => {

    const user = await fakeUsersRepository.create({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    })

    const {token} = await fakeUserTokensRepository.generate(user.id)

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

     await resetPasswordService.execute({
      password: '123456789',
      token: token,
    });

    const updateUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toBeCalledWith('123456789');
    expect(updateUser?.password).toEqual('123456789');

  });

  it('should not be able to reset the password with non-existing token',async() => {
    await expect( resetPasswordService.execute({ token: 'non-existing-token', password: '1234567899' })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user',async() => {
    const token = await fakeUserTokensRepository.generate('non-existing')
    await expect(resetPasswordService.execute({ token: token.token, password: '123456789' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoud not be able to reset a password if passed more than 2 hours', async() => {
    const user = await fakeUsersRepository.create({ name: 'jose', email: 'ze.ssva.batera@gmail.com', password: '12345678' });
    
    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date;

      return customDate.setHours(customDate.getHours() + 3);
    })

    await expect(resetPasswordService.execute({
      password: '123123',
      token
    })).rejects.toBeInstanceOf(AppError);

  });

});