import { ObjectID } from 'mongodb';

import Notifications from '@modules/notifications/infra/typeorm/schemas/Notification';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

export default class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notifications[] = [];
  constructor(){}

  public async create({ content, recipient_id }:ICreateNotificationDTO):Promise<Notifications> {
    const notification = new Notifications();

    Object.assign(notification, {id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;
  }
}