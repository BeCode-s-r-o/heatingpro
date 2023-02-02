import { lazy } from 'react';

const ActivitiesPage = lazy(() => import('./ActivitiesPage'));

const activitiesPageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/nastavenia',
      element: <ActivitiesPage />,
    },
  ],
};

export default activitiesPageConfig;
