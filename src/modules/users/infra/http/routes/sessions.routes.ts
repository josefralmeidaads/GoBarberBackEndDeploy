import { Router } from 'express';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async(request, response) => {
  const { email, password } = request.body;

  console.log(email);

  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.execute({ email, password });

  const userWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    update_at: user.update_at,
  };

  return response.status(200).json({ userWithoutPassword, token });
})

export default sessionsRouter;