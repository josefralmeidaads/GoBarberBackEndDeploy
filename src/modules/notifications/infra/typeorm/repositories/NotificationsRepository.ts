import { getMongoRepository, MongoRepository } from 'typeorm';

import Notifications from '@modules/notifications/infra/typeorm/schemas/Notification';
import ICreateNotificationsDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

export default class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notifications>;
  constructor(){
    this.ormRepository = getMongoRepository(Notifications, 'mongo');
  }
  public async create({ content, recipient_id }: ICreateNotificationsDTO): Promise<Notifications>{
    const notifications = this.ormRepository.create({ content, recipient_id });

    await this.ormRepository.save(notifications);

    return notifications
  }
}