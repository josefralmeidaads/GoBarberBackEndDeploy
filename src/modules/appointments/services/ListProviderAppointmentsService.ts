import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import Appointments from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
export default class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRespository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ){}
  
  public async execute({ provider_id, day, month, year }: IRequest): Promise<Appointments[]>{
    let listAppointments: Appointments[] = [];
    let appointments = await this.cacheProvider.recover<Appointments[]>(`providers_appointments_list:${provider_id}:${year}-${month}-${day}`);

    //let appointments = null;

    if(!appointments){
      listAppointments = await this.appointmentsRepository.findAllInDayFromProvider({ provider_id, day, month, year});
      console.log('query de listagem de appointments feita!');
      await this.cacheProvider.save(`providers_appointments_list:${provider_id}:${year}-${month}-${day}`, classToClass(listAppointments));
    }
    
    if(appointments){
      console.log('usei cache');
      return appointments;
    }
    
    return listAppointments
  }
}