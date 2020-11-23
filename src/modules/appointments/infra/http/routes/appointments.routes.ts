import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appointmentsController = new AppointmentsController();

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);// todas as rotas será validadas por essa middleware de autenticação

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;