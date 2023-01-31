import { ISingleRouteConfig } from 'src/@app/types/TRoutes';
import BoilersConfig from './boilers-admin/BoilersConfig';
import UserBoilersConfig from './boilers-user/UserBoilersConfig';
import CalendarAppConfig from './unused/calendar/CalendarAppConfig';
import ContactsAppConfig from './contacts/ContactsAppConfig';
import FileManagerAppConfig from './unused/file-manager/FileManagerAppConfig';
import HelpCenterAppConfig from './unused/profile/help-center/HelpCenterAppConfig';
import ProfileAppConfig from './unused/profile/profileAppConfig';

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
