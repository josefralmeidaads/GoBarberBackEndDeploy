import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

const passwordRouter = Router();
import ForgotPasswordControllers from '@modules/users/infra/http/controllers/ForgotPasswordControllers';
import ResetPasswordControllers from '@modules/users/infra/http/controllers/ResetPasswordControllers';

const forgotPasswordControllers = new ForgotPasswordControllers();
const resetPasswordControllers = new ResetPasswordControllers();

passwordRouter.post('/forgot', celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
  }
}), forgotPasswordControllers.create);

passwordRouter.post('/reset', celebrate({
  [Segments.BODY]: {
    token: Joi.string().uuid().required(),
    password: Joi.string().required(),
  },
}), resetPasswordControllers.create);

export default passwordRouter;