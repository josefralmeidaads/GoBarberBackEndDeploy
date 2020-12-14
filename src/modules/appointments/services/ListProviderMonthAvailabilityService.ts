import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>; 

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRespository')
    private appointmentsRespository: IAppointmentsRepository,
  ){}

  public async execute({ provider_id, year, month }: IRequest): Promise<IResponse>{
    const appointments = await this.appointmentsRespository.findAllInMonthFromProvider({ provider_id, month, year });

    const numberOfDayInMonth = getDaysInMonth( new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDayInMonth },
      (_, index) => index + 1,
    );

   
     const availability = eachDayArray.map( day => {
      const compareDate = new Date( year, month -1, day, 23, 59, 59);

      const appointmentsInDay = appointments.filter( appointment => { return getDate(appointment.date) === day });
      return {
        day,
        available: isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      }
    });
    
    return availability
  }
}