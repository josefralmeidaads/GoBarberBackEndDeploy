import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateAvatarUsersService from '@modules/users/services/UpdateAvatarUserService';

export default class UserAvatarControllers {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatarUserService = container.resolve(UpdateAvatarUsersService);

    const user = await updateAvatarUserService.execute({user_id: request.user.id, avatarFileName: request.file.filename });

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      update_at: user.update_at,
      avatar: user.avatar,
      avatar_url: user.getAvatarUrl(),
    };

    return response.json(userWithoutPassword);
  }
}