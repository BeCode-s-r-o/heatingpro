import { ISingleRouteConfig } from 'src/@app/types/TRoutes';
import BoilersConfig from './boilers-admin/BoilersConfig';
import UserBoilersConfig from './boilers-user/UserBoilersConfig';
import CalendarAppConfig from './calendar/CalendarAppConfig';
import ContactsAppConfig from './contacts/ContactsAppConfig';
import FileManagerAppConfig from './file-manager/FileManagerAppConfig';
import HelpCenterAppConfig from './help-center/HelpCenterAppConfig';
import ProfileAppConfig from './profile/profileAppConfig';

const appsConfigs: ISingleRouteConfig[] = [
  FileManagerAppConfig,
  ContactsAppConfig,
  CalendarAppConfig,
  HelpCenterAppConfig,
  ProfileAppConfig,
  BoilersConfig,
  UserBoilersConfig,
];

export default appsConfigs;
