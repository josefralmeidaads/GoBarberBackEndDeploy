import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRespository')
    private IAppointmentsRepository: IAppointmentsRepository,
    ) {}

  public async execute({ provider_id ,date }: IRequest): Promise<Appointment> {
    
    const appointmentDate = startOfHour(date); // informando a data inicial e convertendo a string date para a Date do JS

      const findAppointmentInSameDate = await this.IAppointmentsRepository.findByDate(appointmentDate);
  
      if(findAppointmentInSameDate){
         throw new AppError('This appointment is already booked');
      }
  
      const appointment = await this.IAppointmentsRepository.create({ provider_id, date: appointmentDate });


      return appointment;
  }

}

export default CreateAppointmentService;