import { container } from 'tsyringe';

import IStorageProvider from '../StorageProvider/models/IStorageProvider';
import DiskStorageProvider from '../StorageProvider/implementations/DiskStorageProvider';

export const providers = {
  diskStorageProvider: DiskStorageProvider,
}

container.registerSingleton<IStorageProvider>('StorageProvider', providers.diskStorageProvider);