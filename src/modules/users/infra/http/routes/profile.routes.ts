import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();

const profileControllers = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.put('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().allow(null).allow(''),
    old_password: Joi.string().allow(null).allow(''),
  },
}), profileControllers.update);
profileRouter.get('/', profileControllers.show);

export default profileRouter;