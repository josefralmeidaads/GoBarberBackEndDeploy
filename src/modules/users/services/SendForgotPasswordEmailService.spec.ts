import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('Send forgot password email service', () => {
  beforeEach(() => {
     fakeUsersRepository = new FakeUsersRepository();
     fakeUserTokensRepository = new FakeUserTokensRepository();
     fakeMailProvider = new FakeMailProvider();
     sendForgotPasswordEmailService = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider, fakeUserTokensRepository);
  });

  it('should be able to recover the password using the email', async() => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail' );

    await fakeUsersRepository.create({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    })

    await sendForgotPasswordEmailService.execute({
      email: 'ze.ssva.batera@gmail.com'
    });

    expect(sendMail).toHaveBeenCalled();

  });

  it('should not be able to recover a non-existing user password ', async() => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail' );
    
    await expect(sendForgotPasswordEmailService.execute({
      email: 'ze.ssva.batera@gmail.com'
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should generate a forgot password token', async() => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail' );
    const genarateToken = jest.spyOn(fakeUserTokensRepository, 'generate' );
  
    const user = await fakeUsersRepository.create({
      name: 'jose',
      email: 'ze.ssva.batera@gmail.com',
      password: '12345678',
    })

    await sendForgotPasswordEmailService.execute({
      email: 'ze.ssva.batera@gmail.com'
    });

    expect(genarateToken).toHaveBeenCalledWith(user.id);
  });

});