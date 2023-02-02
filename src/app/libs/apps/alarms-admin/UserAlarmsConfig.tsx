import { lazy } from 'react';
import { ISingleRouteConfig } from 'src/@app/types/TRoutes';

const AdminAlarmList = lazy(() => import('./components/AdminAlarmList'));

const AdminAlarmConfig: ISingleRouteConfig = {
  routes: [
    {
      path: 'alarmy',
      children: [
        {
          path: '',
          element: <AdminAlarmList />,
        },
      ],
    },
  ],
};

export default AdminAlarmConfig;
