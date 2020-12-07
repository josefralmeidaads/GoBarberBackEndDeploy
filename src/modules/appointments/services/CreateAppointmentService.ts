import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRespository')
    private IAppointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private INotificationsRepository: INotificationsRepository,
    ) {}

  public async execute({ provider_id , date, user_id }: IRequest): Promise<Appointment> {
    
    const appointmentDate = startOfHour(date); // informando a data inicial e convertendo a string date para a Date do JS

    if(isBefore(appointmentDate , Date.now())){
      throw new AppError('This horary is invalid!');
    }

    if( provider_id === user_id){
      throw new AppError("Can't register appointment within same user as provider");
    }

    if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17 ){
      throw new AppError("Cant register appointment before 8am or after 18pm");
    }

    const findAppointmentInSameDate = await this.IAppointmentsRepository.findByDate(appointmentDate);

    if(findAppointmentInSameDate){
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.IAppointmentsRepository.create({ provider_id, date: appointmentDate, user_id });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'" );

    await this.INotificationsRepository.create({ content: `Novo agendamento para ${dateFormatted}`, recipient_id:provider_id });

    return appointment;
  }

}

export default CreateAppointmentService;