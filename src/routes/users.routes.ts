import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import UpdateAvatarUsersService from '../services/UpdateAvatarUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();
const upload = multer(uploadConfig);


usersRouter.post('/', async(request, response) => {
      const { name, email, password } = request.body;

      const createUser = new CreateUserService();

      const user = await createUser.execute({ name, email, password});

      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        update_at: user.update_at,
      };

      return response.status(200).json(userWithoutPassword);
})

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'),async(request, response) => {
    const updateAvatarUserService = new UpdateAvatarUsersService();

    const user = await updateAvatarUserService.execute({user_id: request.user.id, avatarFileName: request.file.filename });

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      update_at: user.update_at,
      avatar: user.avatar
    };

    return response.json(userWithoutPassword);
})

export default usersRouter;