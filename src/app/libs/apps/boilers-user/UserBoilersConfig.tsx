import { lazy } from 'react';
import { ISingleRouteConfig } from 'src/@app/types/TRoutes';

const BoilersList = lazy(() => import('./components/list/UserBoilersList'));
const BoilersDetail = lazy(() => import('./components/detail/UserBoilersDetail'));

const UserBoilersConfig: ISingleRouteConfig = {
  routes: [
    {
      path: 'pouzivatelske-systemy',
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

export default UserBoilersConfig;
