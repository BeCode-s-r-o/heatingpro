import { selectUser } from 'app/store/userSlice';
import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { ISingleRouteConfig } from 'src/@app/types/TRoutes';

const BoilersList = lazy(() => import('./components/list/BoilersList'));
const BoilersDetail = lazy(() => import('./components/detail/BoilersDetail'));

const UserBoilersConfig: ISingleRouteConfig = {
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

export default UserBoilersConfig;
