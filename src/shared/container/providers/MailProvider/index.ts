import { container } from 'tsyringe';

import mailConfig from '@config/mail';
import IMailProvider from './models/IMailProvider';
import EtheralMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

export const providers = {
  ethereal: EtheralMailProvider,
  ses: SESMailProvider,
}

container.registerSingleton<IMailProvider>('MailProvider', providers[mailConfig.driver]);

