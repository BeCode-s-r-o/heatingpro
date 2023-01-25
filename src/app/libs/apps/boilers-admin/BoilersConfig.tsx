import { lazy } from 'react';
import { ISingleRouteConfig } from 'src/@app/types/TRoutes';

const BoilersList = lazy(() => import('./components/list/BoilersList'));
const BoilersDetail = lazy(() => import('./components/detail/BoilersDetail'));

const BoilersConfig: ISingleRouteConfig = {
  routes: [
    {
      path: 'systemy',
      children: [
        {
          path: '',
          element: <BoilersList />,
        },
        {
          path: ':id',
          element: <BoilersDetail />,
        },
      ],
    },
  ],
};

export default BoilersConfig;
