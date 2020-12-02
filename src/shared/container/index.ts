import { container } from 'tsyringe';

import '@modules/users/providers';
import '@shared/container/providers';

import IAppointmentsRespository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRespository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRespository from '@modules/users/repositories/IUsersRepository';
import UsersRespository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRespository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRespository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

container.registerSingleton<IAppointmentsRespository>('AppointmentsRespository', AppointmentsRespository);
container.registerSingleton<IUsersRespository>('UsersRepository', UsersRespository);
container.registerSingleton<IUserTokensRespository>('UserTokensRepository', UserTokensRespository);