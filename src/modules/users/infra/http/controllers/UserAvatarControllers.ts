import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateAvatarUsersService from '@modules/users/services/UpdateAvatarUserService';
import { classToClass } from 'class-transformer';

export default class UserAvatarControllers {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatarUserService = container.resolve(UpdateAvatarUsersService);

    const user = await updateAvatarUserService.execute({user_id: request.user.id, avatarFileName: request.file.filename });

    return response.json({ user: classToClass(user)});
  }
}