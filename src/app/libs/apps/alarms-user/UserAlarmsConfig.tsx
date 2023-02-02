import { lazy } from 'react';
import { ISingleRouteConfig } from 'src/@app/types/TRoutes';

const UserAlarmList = lazy(() => import('./components/UserAlarmList'));

const UserAlarmsConfig: ISingleRouteConfig = {
  routes: [
    {
      path: 'pouzivatelske-alarmy',
      children: [
        {
          path: '',
          element: <UserAlarmList />,
        },
      ],
    },
  ],
};

export default UserAlarmsConfig;
