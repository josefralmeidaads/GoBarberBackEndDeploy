import AppError from '@shared/errors/AppError';
import FakeICacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeICacheProvider: FakeICacheProvider;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeICacheProvider = new FakeICacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(fakeAppointmentsRepository, fakeICacheProvider);
  });

  it('should be able list ti provider appointments', async() => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: '123123',
      date: new Date(2020, 11, 7, 15, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: '123123',
      date: new Date(2020, 11, 7, 16, 0, 0),
    });

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: '123',
      day: 7,
      month: 12,
      year: 2020,
    });

    expect(appointments).toEqual(expect.arrayContaining([
      appointment1, appointment2
    ]));
  });

});