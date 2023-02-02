import { ISingleRouteConfig } from 'src/@app/types/TRoutes';
import BoilersConfig from './boilers-admin/BoilersConfig';
import UserBoilersConfig from './boilers-user/UserBoilersConfig';
import CalendarAppConfig from './calendar/CalendarAppConfig';
import ContactsAppConfig from './contacts/ContactsAppConfig';
import ProfileAppConfig from './profile/ProfileAppConfig';
import UserAlarmsConfig from './alarms-user/UserAlarmsConfig';
import AdminAlarmConfig from './alarms-admin/UserAlarmsConfig';

const appsConfigs: ISingleRouteConfig[] = [
  ContactsAppConfig,
  CalendarAppConfig,
  ProfileAppConfig,
  BoilersConfig,
  UserBoilersConfig,
  UserAlarmsConfig,
  AdminAlarmConfig,
];

export default appsConfigs;
