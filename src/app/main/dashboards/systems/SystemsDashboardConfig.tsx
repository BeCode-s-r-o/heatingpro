import { lazy } from 'react';
import { ISingleRouteConfig } from 'src/app/types/TRoutes';

const SystemsDashboardApp = lazy(() => import('./SystemsDashboardApp'));

const SystemsDasboardConfig: ISingleRouteConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'systemy',
      element: <SystemsDashboardApp />,
    },
  ],
};

export default SystemsDasboardConfig;
