import { Router } from 'express';

import ProviderController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
 
const providersRouter = Router();

const providersController = new ProviderController();

providersRouter.use(ensureAuthenticated);
providersRouter.get('/',providersController.index);

export default providersRouter;