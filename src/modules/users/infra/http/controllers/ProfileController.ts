import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileControllers {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const showUser = container.resolve(ShowProfileService);

    const user = await showUser.execute({ user_id });

    const userWithoutPassword = { //imprimindo usuario sem a senha de acesso
      user_id,
      id: user?.id,
      name: user?.name,
      email: user?.email,
      created_at: user?.created_at,
      update_at: user?.update_at,
    };

    return response.status(200).json(userWithoutPassword);
  }

  public async update(request: Request, response: Response): Promise<Response> {
      const user_id = request.user.id;
      const { name, email, password, old_password } = request.body;
  
      const updateUser = container.resolve(UpdateUserService);

      const user = await updateUser.execute({ user_id, name, email, password, old_password  });

      const userWithoutPassword = {
        user_id,
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        update_at: user.update_at,
        avatar: user.avatar,
        avatar_url: user.getAvatarUrl(),
      };

      return response.status(200).json(userWithoutPassword);
  }
    
}