import { inject, injectable } from 'tsyringe';

import Appointments from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

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
    private appointmentsRepository: IAppointmentsRepository
  ){}
  
  public async execute({ provider_id, day, month, year }: IRequest): Promise<Appointments[]>{
    const listAppointments = await this.appointmentsRepository.findAllInDayFromProvider({ provider_id, day, month, year});

    return listAppointments
  }
}