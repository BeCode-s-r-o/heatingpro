import { lazy } from 'react';

const CalendarApp = lazy(() => import('./CalendarApp'));

const CalendarAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/kalendar',
      element: <CalendarApp />,
    },
  ],
};

export default CalendarAppConfig;
