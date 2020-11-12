import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import CreateApointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);// todas as rotas será validadas por essa middleware de autenticação

appointmentsRouter.get('/', async(request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentRepository);
    const appointments = await appointmentsRepository.find();
    return response.json(appointments);
});

appointmentsRouter.post('/', async(request, response) => {
    try{
      const { provider_id , date } = request.body;

      const parsedDate = parseISO(date);

      const createApointmentService = new CreateApointmentService();

      const appointment = await createApointmentService.execute({ provider_id, date: parsedDate});
    
      return response.status(200).json(appointment);
    }catch(err){
      return response.status(400).json({ error: err.message });
    }
})

export default appointmentsRouter;