import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository : FakeAppointmentsRepository;
let listProviderMonthAvailabilityService : ListProviderMonthAvailabilityService;

describe('List Provider Month Availability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository);
  });

  it('it should be able to list month avalability from providers', async() => {
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 8, 0, 0), provider_id: '123', user_id: '123'});
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 9, 0, 0), provider_id: '123', user_id: '123'});
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 10, 0, 0), provider_id: '123', user_id: '123'});
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 11, 0, 0), provider_id: '123', user_id: '123'});
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 12, 0, 0), provider_id: '123', user_id: '123'});
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 13, 0, 0), provider_id: '123', user_id: '123'});
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 14, 0, 0), provider_id: '123', user_id: '123'});
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 15, 0, 0), provider_id: '123', user_id: '123'});
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 16, 0, 0), provider_id: '123', user_id: '123'});
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 17, 0, 0), provider_id: '123', user_id: '123'});
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 21, 8, 0, 0), provider_id: '123', user_id: '123'});
    
    const listProviderMonth = await listProviderMonthAvailabilityService.execute({ provider_id: '123', month: 5, year: 2020 });

    expect(listProviderMonth).toEqual(
     expect.arrayContaining([
      { day: 19, available: true }, 
      { day: 20, available: false },  
      { day: 21, available: true }, 
      { day: 22, available: true },
     ])
    );
  });

  
});