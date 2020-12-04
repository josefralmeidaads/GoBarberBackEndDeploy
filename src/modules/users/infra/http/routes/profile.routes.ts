import { Router } from 'express';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();

const profileControllers = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.put('/', profileControllers.update);
profileRouter.get('/', profileControllers.show);

export default profileRouter;