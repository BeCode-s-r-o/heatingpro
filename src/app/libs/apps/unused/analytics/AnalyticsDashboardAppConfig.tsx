import { lazy } from 'react';
import { ISingleRouteConfig } from 'src/@app/types/TRoutes';

const AnalyticsDashboardApp = lazy(() => import('./AnalyticsDashboardApp'));

const TODO = true;

const AnalyticsDashboardAppConfig: ISingleRouteConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboards/analytics',
      element: TODO ? <h1>TODO</h1> : <AnalyticsDashboardApp />,
    },
  ],
};

export default AnalyticsDashboardAppConfig;
