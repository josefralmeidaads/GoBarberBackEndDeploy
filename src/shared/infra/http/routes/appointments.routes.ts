import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import AppointmentRepository from '../../../../modules/appointments/repositories/AppointmentsRepository';
import CreateApointmentService from '../../../../modules/appointments/services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);// todas as rotas será validadas por essa middleware de autenticação

appointmentsRouter.get('/', async(request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentRepository);
    const appointments = await appointmentsRepository.find();
    return response.json(appointments);
});

appointmentsRouter.post('/', async(request, response) => {
      const { provider_id , date } = request.body;

      const parsedDate = parseISO(date);

      const createApointmentService = new CreateApointmentService();

      const appointment = await createApointmentService.execute({ provider_id, date: parsedDate});
    
      return response.status(200).json(appointment);
    
})

export default appointmentsRouter;