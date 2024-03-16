import { ISingleRouteConfig } from 'src/@app/types/TRoutes';
import BoilersConfig from './boilers/BoilersConfig';

import ContactsAppConfig from './contacts/ContactsAppConfig';

const appsConfigs: ISingleRouteConfig[] = [ContactsAppConfig, BoilersConfig];

export default appsConfigs;
