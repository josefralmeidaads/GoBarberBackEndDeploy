import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let resetPasswordService: ResetPasswordService;
let fakeHashProviderProvider: FakeHashProvider;

describe('Send forgot password email service', () => {
  beforeEach(() => {
     fakeUsersRepository = new FakeUsersRepository();
     fakeUserTokensRepository = new FakeUserTokensRepository();
     fakeMailProvider = new FakeMailProvider();
     fakeHashProviderProvider = new FakeHashProvider();
     resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository, fakeHashProviderProvider);
  });

  it('should be able to reset password', async() => {

    const user = await fakeUsersRepository.create({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    })

    const token = await fakeUserTokensRepository.generate(user.id)

    const resetPassword = await resetPasswordService.execute({
      password: '123456789',
      token: token.token,
    });

    const updateUser = await fakeUsersRepository.findById(user.id);

    expect(updateUser?.password).toEqual('123456789');

  });

});