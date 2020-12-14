import AppError from '@shared/errors/AppError';
import FakeICacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeICacheProvider: FakeICacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeICacheProvider = new FakeICacheProvider();
    fakeNotificationsRepository= new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository, fakeNotificationsRepository, fakeICacheProvider);
  });
  it('should be able to create a new appointment', async() => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 11, 5, 17).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 11, 6, 17),
      provider_id: '123123',
      user_id: '123',
    })

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointments on the same time', async() => {
    const appointmentDate = new Date(2020, 11, 20, 8);// crie um agendamento no ano 2020, mês de Maio, dia 10, as 11 horas da manhã

     await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: '123',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123123',
        user_id: '123',
      })
    ).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment on a past date', async() => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 12).getTime();
    });

    await expect(createAppointment.execute({ date: new Date(2020, 3, 10, 12), provider_id: '123123', user_id: '123' })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment within same user as provider', async() => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 11, 21, 12).getTime();
    });

    await expect(createAppointment.execute({ date: new Date(2020, 11, 7, 12), provider_id: '123', user_id: '123' })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment after 18 hours and before 8 hours', async() => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 11, 22, 12).getTime();
    });

    await expect(createAppointment.execute({ date: new Date(2020, 11, 7, 7), provider_id: '123123', user_id: '123' })).rejects.toBeInstanceOf(AppError);
    await expect(createAppointment.execute({ date: new Date(2020, 11, 7, 19), provider_id: '123123', user_id: '123' })).rejects.toBeInstanceOf(AppError);
  });

});