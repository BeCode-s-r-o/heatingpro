import { ISingleRouteConfig } from 'src/@app/types/TRoutes';
import BoilersConfig from './boilers/BoilersConfig';
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
];

export default appsConfigs;
