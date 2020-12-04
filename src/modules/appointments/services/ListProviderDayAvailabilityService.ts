import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { da } from 'date-fns/locale';

interface IRequest {
  provider_id: string;
  year: number; 
  month: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRespository')
    private appointmentsRepository: IAppointmentsRepository,
  ){}

  public async execute({ provider_id, day, month, year }: IRequest): Promise<IResponse>{

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({ provider_id, year, month, day });

    const hourStart = 8;

    const eachHourArray = Array.from({ length: 10 }, (_, index) => index + hourStart );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map( hour => {
      const appointmentInHour = appointments.find(appointment => getHours(appointment.date) === hour);
      
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !appointmentInHour && isAfter(compareDate, currentDate),
      };
    });
    
    
    return availability
  }
}