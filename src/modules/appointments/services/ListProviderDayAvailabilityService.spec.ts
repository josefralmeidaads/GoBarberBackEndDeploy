import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

let fakeAppointmentsRepository : FakeAppointmentsRepository;
let listProviderDayAvailabilityService : ListProviderDayAvailabilityService;

describe('List Provider Month Availability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(fakeAppointmentsRepository);
  });

  it('it should be able to list the day avalability from providers validate now Hour', async() => {
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 14, 0, 0), provider_id: '123', user_id: '123'});
    await fakeAppointmentsRepository.create({ date: new Date(2020, 4, 20, 16, 0, 0), provider_id: '123', user_id: '123'});

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });
    
    const listProviderDay = await listProviderDayAvailabilityService.execute({ provider_id: '123', day: 20, month: 5, year: 2020 });

    expect(listProviderDay).toEqual(
     expect.arrayContaining([
      { hour: 8, available: false }, 
      { hour: 9, available: false}, 
      { hour: 10, available: false },  
      { hour: 13, available: true },  
      { hour: 14, available: false }, 
      { hour: 16, available: false },
      { hour: 17, available: true },
     ])
    );
  });

  
});