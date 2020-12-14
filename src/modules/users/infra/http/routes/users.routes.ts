import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi, Segments } from 'celebrate';

import uploadConfig from '@config/upload';

import UsersControllers from '@modules/users/infra/http/controllers/UsersControllers';
import UserAvatarControllers from '@modules/users/infra/http/controllers/UserAvatarControllers';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);

const usersControllers = new UsersControllers();
const userAvatarControllers = new UserAvatarControllers();

usersRouter.post('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
}), usersControllers.create);

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), userAvatarControllers.update);

export default usersRouter;