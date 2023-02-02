import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Error404Page = lazy(() => import('./Error404Page'));

const errorPagesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '404',
      element: <Error404Page />,
    },
  ],
};

export default errorPagesConfig;
