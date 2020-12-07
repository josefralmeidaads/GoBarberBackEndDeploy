import ICreateNotificationsDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notifications from '@modules/notifications/infra/typeorm/schemas/Notification';

export default interface INotificationsRespository {
  create(data: ICreateNotificationsDTO): Promise<Notifications>;
}