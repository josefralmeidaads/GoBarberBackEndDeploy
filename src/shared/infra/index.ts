import express from 'express';
import appointmentsRouter from './http/routes/appointments.routes';
import usersRouter from './http/routes/users.routes';
import sessionsRouter from './http/routes/sessions.routes';

const routes = express.Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;

