import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response>{
    const provider_id = request.user.id; // usuario logado na rota
    const { day, month, year } = request.body;

    const listProviderAppointmentsService = container.resolve(ListProviderAppointmentsService);

    const appointments =  await listProviderAppointmentsService.execute({ provider_id, day, month, year });

    console.log(appointments);

    return response.status(200).json(appointments);
  }
}