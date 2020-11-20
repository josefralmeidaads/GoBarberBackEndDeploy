import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../../../config/upload';
import User from '../entities/User';
import AppError from '../../../shared/errors/AppError';

interface Request {
    user_id: string,
    avatarFileName: string;
}

class UpdateUserAvatarService {

    public async execute({ user_id, avatarFileName }: Request): Promise<User>{
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(user_id);

        if(!user){
            throw new AppError('Only authenticated users can change your avatar', 401);
        }

        if(user.avatar){
            //Deleter avatar anterior
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if(userAvatarFileExists){
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFileName;

        await usersRepository.save(user); // atualizando o arquivo;

        return user;
    }
}

export default UpdateUserAvatarService;