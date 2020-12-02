import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateApointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id , date } = request.body;

    const parsedDate = parseISO(date);

    const createApointmentService = container.resolve(CreateApointmentService);

    const appointment = await createApointmentService.execute({ provider_id, date: parsedDate});
  
    return response.status(200).json(appointment)
  }
}